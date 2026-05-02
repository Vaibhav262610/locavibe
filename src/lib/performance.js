class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = new Map();
        this.isEnabled = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true';

        if (this.isEnabled && typeof window !== 'undefined') {
            this.initializeObservers();
            this.startMetricsCollection();
        }
    }

    initializeObservers() {
        // Performance Observer for navigation timing
        if ('PerformanceObserver' in window) {
            // Navigation timing
            const navObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.recordNavigationMetrics(entry);
                }
            });
            navObserver.observe({ entryTypes: ['navigation'] });
            this.observers.set('navigation', navObserver);

            // Resource timing
            const resourceObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.recordResourceMetrics(entry);
                }
            });
            resourceObserver.observe({ entryTypes: ['resource'] });
            this.observers.set('resource', resourceObserver);

            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.recordMetric('LCP', lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            this.observers.set('lcp', lcpObserver);

            // First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.recordMetric('FID', entry.processingStart - entry.startTime);
                }
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
            this.observers.set('fid', fidObserver);

            // Cumulative Layout Shift
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.recordMetric('CLS', clsValue);
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
            this.observers.set('cls', clsObserver);
        }

        // Intersection Observer for element visibility
        if ('IntersectionObserver' in window) {
            const visibilityObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const elementId = entry.target.id || entry.target.className;
                        this.recordMetric('element_visible', {
                            element: elementId,
                            timestamp: Date.now()
                        });
                    }
                });
            });
            this.observers.set('visibility', visibilityObserver);
        }
    }

    startMetricsCollection() {
        // Memory usage monitoring
        if ('memory' in performance) {
            setInterval(() => {
                this.recordMetric('memory', {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit
                });
            }, 30000); // Every 30 seconds
        }

        // Connection monitoring
        if ('connection' in navigator) {
            this.recordMetric('connection', {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            });

            navigator.connection.addEventListener('change', () => {
                this.recordMetric('connection_change', {
                    effectiveType: navigator.connection.effectiveType,
                    downlink: navigator.connection.downlink,
                    rtt: navigator.connection.rtt,
                    timestamp: Date.now()
                });
            });
        }

        // Page visibility monitoring
        document.addEventListener('visibilitychange', () => {
            this.recordMetric('visibility_change', {
                hidden: document.hidden,
                timestamp: Date.now()
            });
        });

        // Error monitoring
        window.addEventListener('error', (event) => {
            this.recordError({
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack,
                timestamp: Date.now()
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.recordError({
                message: 'Unhandled Promise Rejection',
                reason: event.reason,
                timestamp: Date.now()
            });
        });
    }

    recordNavigationMetrics(entry) {
        const metrics = {
            // DNS lookup time
            dnsLookup: entry.domainLookupEnd - entry.domainLookupStart,

            // TCP connection time
            tcpConnection: entry.connectEnd - entry.connectStart,

            // SSL negotiation time
            sslNegotiation: entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : 0,

            // Time to First Byte
            ttfb: entry.responseStart - entry.requestStart,

            // Response download time
            responseDownload: entry.responseEnd - entry.responseStart,

            // DOM processing time
            domProcessing: entry.domComplete - entry.domLoading,

            // Load event time
            loadEvent: entry.loadEventEnd - entry.loadEventStart,

            // Total page load time
            totalLoadTime: entry.loadEventEnd - entry.navigationStart
        };

        Object.entries(metrics).forEach(([key, value]) => {
            this.recordMetric(`navigation_${key}`, value);
        });
    }

    recordResourceMetrics(entry) {
        const resourceType = entry.initiatorType;
        const size = entry.transferSize || entry.encodedBodySize;
        const duration = entry.responseEnd - entry.startTime;

        this.recordMetric('resource_load', {
            type: resourceType,
            name: entry.name,
            size: size,
            duration: duration,
            cached: entry.transferSize === 0 && entry.encodedBodySize > 0
        });

        // Track slow resources
        if (duration > 1000) { // Slower than 1 second
            this.recordMetric('slow_resource', {
                type: resourceType,
                name: entry.name,
                duration: duration
            });
        }
    }

    recordMetric(name, value) {
        if (!this.isEnabled) return;

        const timestamp = Date.now();
        const metric = {
            name,
            value,
            timestamp,
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        // Store locally
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }
        this.metrics.get(name).push(metric);

        // Send to analytics service (implement based on your needs)
        this.sendToAnalytics(metric);
    }

    recordError(error) {
        if (!this.isEnabled) return;

        const errorMetric = {
            type: 'error',
            ...error,
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        this.sendToAnalytics(errorMetric);
    }

    // Custom timing for React components
    startTiming(label) {
        if (!this.isEnabled) return;

        const startTime = performance.now();
        return {
            end: () => {
                const duration = performance.now() - startTime;
                this.recordMetric(`custom_timing_${label}`, duration);
                return duration;
            }
        };
    }

    // Track user interactions
    trackInteraction(action, element, metadata = {}) {
        if (!this.isEnabled) return;

        this.recordMetric('user_interaction', {
            action,
            element,
            ...metadata,
            timestamp: Date.now()
        });
    }

    // Track API calls
    trackAPICall(endpoint, method, duration, status, error = null) {
        if (!this.isEnabled) return;

        this.recordMetric('api_call', {
            endpoint,
            method,
            duration,
            status,
            error,
            timestamp: Date.now()
        });
    }

    // Get performance summary
    getPerformanceSummary() {
        const summary = {};

        this.metrics.forEach((values, name) => {
            if (values.length > 0) {
                const numericValues = values
                    .map(v => typeof v.value === 'number' ? v.value : 0)
                    .filter(v => v > 0);

                if (numericValues.length > 0) {
                    summary[name] = {
                        count: values.length,
                        avg: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
                        min: Math.min(...numericValues),
                        max: Math.max(...numericValues),
                        latest: values[values.length - 1].value
                    };
                }
            }
        });

        return summary;
    }

    // Send metrics to analytics service
    async sendToAnalytics(metric) {
        try {
            // Batch metrics to reduce requests
            if (!this.pendingMetrics) {
                this.pendingMetrics = [];
            }

            this.pendingMetrics.push(metric);

            // Send batch every 10 seconds or when we have 50 metrics
            if (!this.batchTimeout) {
                this.batchTimeout = setTimeout(() => {
                    this.flushMetrics();
                }, 10000);
            }

            if (this.pendingMetrics.length >= 50) {
                this.flushMetrics();
            }
        } catch (error) {
            console.error('Failed to send metrics:', error);
        }
    }

    async flushMetrics() {
        if (!this.pendingMetrics || this.pendingMetrics.length === 0) return;

        try {
            // Send to your analytics endpoint
            await fetch('/api/analytics/performance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    metrics: this.pendingMetrics,
                    sessionId: this.getSessionId(),
                    userId: this.getUserId()
                })
            });

            this.pendingMetrics = [];
            if (this.batchTimeout) {
                clearTimeout(this.batchTimeout);
                this.batchTimeout = null;
            }
        } catch (error) {
            console.error('Failed to flush metrics:', error);
        }
    }

    getSessionId() {
        if (!this.sessionId) {
            this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        return this.sessionId;
    }

    getUserId() {
        // Get from your auth system
        return localStorage.getItem('userId') || 'anonymous';
    }

    // Cleanup
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();

        if (this.batchTimeout) {
            clearTimeout(this.batchTimeout);
        }

        this.flushMetrics();
    }
}

// React Hook for performance monitoring
export const usePerformanceMonitor = () => {
    const monitor = React.useRef(null);

    React.useEffect(() => {
        if (!monitor.current) {
            monitor.current = new PerformanceMonitor();
        }

        return () => {
            if (monitor.current) {
                monitor.current.destroy();
            }
        };
    }, []);

    return {
        startTiming: (label) => monitor.current?.startTiming(label),
        trackInteraction: (action, element, metadata) =>
            monitor.current?.trackInteraction(action, element, metadata),
        trackAPICall: (endpoint, method, duration, status, error) =>
            monitor.current?.trackAPICall(endpoint, method, duration, status, error),
        getPerformanceSummary: () => monitor.current?.getPerformanceSummary()
    };
};

export const performanceMonitor = new PerformanceMonitor();
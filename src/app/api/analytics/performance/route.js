import { NextResponse } from "next/server";
import { connectDb } from "@/db/db";

// In-memory storage for performance metrics (in production, use Redis or database)
let performanceMetrics = [];
const MAX_METRICS = 1000;

export async function POST(request) {
    try {
        const body = await request.json();
        const { metrics, sessionId, userId } = body;

        if (!metrics || !Array.isArray(metrics)) {
            return NextResponse.json({ error: "Invalid metrics data" }, { status: 400 });
        }

        // Process and store metrics
        const processedMetrics = metrics.map(metric => ({
            ...metric,
            sessionId,
            userId: userId || 'anonymous',
            receivedAt: new Date().toISOString(),
            userAgent: request.headers.get('user-agent'),
            ip: request.headers.get('x-forwarded-for') || 'unknown'
        }));

        // Add to in-memory storage (rotate if too many)
        performanceMetrics.push(...processedMetrics);
        if (performanceMetrics.length > MAX_METRICS) {
            performanceMetrics = performanceMetrics.slice(-MAX_METRICS);
        }

        // Log critical performance issues
        processedMetrics.forEach(metric => {
            if (metric.name === 'LCP' && metric.value > 2500) {
                console.warn(`⚠️ Poor LCP detected: ${metric.value}ms for ${metric.url}`);
            }
            if (metric.name === 'FID' && metric.value > 100) {
                console.warn(`⚠️ Poor FID detected: ${metric.value}ms for ${metric.url}`);
            }
            if (metric.name === 'CLS' && metric.value > 0.1) {
                console.warn(`⚠️ Poor CLS detected: ${metric.value} for ${metric.url}`);
            }
        });

        return NextResponse.json({
            success: true,
            processed: processedMetrics.length,
            message: "Performance metrics recorded"
        });

    } catch (error) {
        console.error("Performance API error:", error);
        return NextResponse.json(
            { error: "Failed to process performance metrics" },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const timeRange = url.searchParams.get('timeRange') || '1h';
        const metricType = url.searchParams.get('type');

        // Calculate time threshold
        const now = new Date();
        const timeThresholds = {
            '1h': new Date(now.getTime() - 60 * 60 * 1000),
            '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000),
            '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        };

        const threshold = timeThresholds[timeRange] || timeThresholds['1h'];

        // Filter metrics by time range
        let filteredMetrics = performanceMetrics.filter(
            metric => new Date(metric.receivedAt) > threshold
        );

        // Filter by metric type if specified
        if (metricType) {
            filteredMetrics = filteredMetrics.filter(
                metric => metric.name === metricType
            );
        }

        // Calculate summary statistics
        const summary = calculatePerformanceSummary(filteredMetrics);

        return NextResponse.json({
            success: true,
            timeRange,
            metricType,
            summary,
            totalMetrics: filteredMetrics.length,
            metrics: filteredMetrics.slice(-100) // Return last 100 for detailed view
        });

    } catch (error) {
        console.error("Performance GET API error:", error);
        return NextResponse.json(
            { error: "Failed to retrieve performance metrics" },
            { status: 500 }
        );
    }
}

function calculatePerformanceSummary(metrics) {
    const summary = {
        coreWebVitals: {
            LCP: { values: [], avg: 0, p75: 0, p95: 0 },
            FID: { values: [], avg: 0, p75: 0, p95: 0 },
            CLS: { values: [], avg: 0, p75: 0, p95: 0 }
        },
        navigation: {
            ttfb: { values: [], avg: 0 },
            domContentLoaded: { values: [], avg: 0 },
            loadComplete: { values: [], avg: 0 }
        },
        errors: [],
        userAgents: {},
        pages: {}
    };

    metrics.forEach(metric => {
        // Core Web Vitals
        if (['LCP', 'FID', 'CLS'].includes(metric.name) && typeof metric.value === 'number') {
            summary.coreWebVitals[metric.name].values.push(metric.value);
        }

        // Navigation metrics
        if (metric.name.startsWith('navigation_') && typeof metric.value === 'number') {
            const navMetric = metric.name.replace('navigation_', '');
            if (summary.navigation[navMetric]) {
                summary.navigation[navMetric].values.push(metric.value);
            }
        }

        // Errors
        if (metric.type === 'error') {
            summary.errors.push({
                message: metric.message,
                url: metric.url,
                timestamp: metric.receivedAt
            });
        }

        // User agents
        if (metric.userAgent) {
            summary.userAgents[metric.userAgent] = (summary.userAgents[metric.userAgent] || 0) + 1;
        }

        // Pages
        if (metric.url) {
            const page = new URL(metric.url).pathname;
            summary.pages[page] = (summary.pages[page] || 0) + 1;
        }
    });

    // Calculate statistics for Core Web Vitals
    Object.keys(summary.coreWebVitals).forEach(vital => {
        const values = summary.coreWebVitals[vital].values;
        if (values.length > 0) {
            values.sort((a, b) => a - b);
            summary.coreWebVitals[vital].avg = values.reduce((a, b) => a + b, 0) / values.length;
            summary.coreWebVitals[vital].p75 = values[Math.floor(values.length * 0.75)];
            summary.coreWebVitals[vital].p95 = values[Math.floor(values.length * 0.95)];
        }
    });

    // Calculate statistics for navigation metrics
    Object.keys(summary.navigation).forEach(nav => {
        const values = summary.navigation[nav].values;
        if (values.length > 0) {
            summary.navigation[nav].avg = values.reduce((a, b) => a + b, 0) / values.length;
        }
    });

    return summary;
}
import { io } from 'socket.io-client';

class WebSocketManager {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 2;
        this.isConnected = false;
        this.simulationMode = true; // Enable simulation by default
    }

    connect(userId) {
        if (this.isConnected) return;

        // Use simulation mode for demo
        if (this.simulationMode) {
            setTimeout(() => {
                this.isConnected = true;
                this.emit('connection_status', { connected: true });
                console.log('WebSocket simulation: Connected');

                // Simulate some demo notifications
                this.simulateNotifications();
            }, 1000);
            return;
        }

        // Real connection code (when server is available)
        try {
            this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001', {
                auth: { userId, token: localStorage.getItem('authToken') },
                transports: ['websocket', 'polling'],
                timeout: 3000
            });
            this.setupEventHandlers();
        } catch (error) {
            console.log('WebSocket server unavailable, using simulation');
            this.simulationMode = true;
            this.connect(userId);
        }
    }

    simulateNotifications() {
        // Simulate periodic notifications for demo
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every 10 seconds
                const notifications = [
                    { type: 'review_notification', message: 'New review posted for Pal Dhaba' },
                    { type: 'like_notification', message: 'Someone liked your review' },
                    { type: 'follow_notification', message: 'You have a new follower' }
                ];
                const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
                this.emit(randomNotification.type, {
                    message: randomNotification.message,
                    timestamp: new Date().toISOString()
                });
            }
        }, 10000);
    }

    setupEventHandlers() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('WebSocket connected');
            this.isConnected = true;
            this.emit('connection_status', { connected: true });
        });

        this.socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
            this.isConnected = false;
            this.emit('connection_status', { connected: false });
        });

        this.socket.on('connect_error', () => {
            console.log('WebSocket connection failed, switching to simulation');
            this.simulationMode = true;
            this.socket.disconnect();
            this.connect();
        });
    }

    subscribe(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);

        return () => {
            const eventListeners = this.listeners.get(event);
            if (eventListeners) {
                eventListeners.delete(callback);
            }
        };
    }

    emit(event, data) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.forEach(callback => callback(data));
        }
    }

    sendMessage(event, data) {
        if (this.socket?.connected) {
            this.socket.emit(event, data);
        } else if (this.simulationMode) {
            console.log('WebSocket simulation: Sent', event, data);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.isConnected = false;
        this.listeners.clear();
    }
}

export const wsManager = new WebSocketManager();
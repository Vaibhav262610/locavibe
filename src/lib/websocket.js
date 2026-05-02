import { io } from 'socket.io-client';

class WebSocketManager {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    connect(userId) {
        if (this.socket?.connected) return;

        this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001', {
            auth: {
                userId,
                token: localStorage.getItem('authToken')
            },
            transports: ['websocket', 'polling'],
            upgrade: true,
            rememberUpgrade: true
        });

        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.socket.on('connect', () => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;
            this.emit('connection_status', { connected: true });
        });

        this.socket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason);
            this.emit('connection_status', { connected: false, reason });
            this.handleReconnection();
        });

        this.socket.on('new_review', (data) => {
            this.emit('new_review', data);
        });

        this.socket.on('review_liked', (data) => {
            this.emit('review_liked', data);
        });

        this.socket.on('user_followed', (data) => {
            this.emit('user_followed', data);
        });

        this.socket.on('restaurant_updated', (data) => {
            this.emit('restaurant_updated', data);
        });

        this.socket.on('notification', (data) => {
            this.emit('notification', data);
        });
    }

    handleReconnection() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            setTimeout(() => {
                this.reconnectAttempts++;
                this.socket?.connect();
            }, Math.pow(2, this.reconnectAttempts) * 1000);
        }
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
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.listeners.clear();
    }
}

export const wsManager = new WebSocketManager();
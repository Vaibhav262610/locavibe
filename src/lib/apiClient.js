import axios from 'axios';
import { toast } from 'react-hot-toast';

class APIClient {
    constructor() {
        this.client = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('authToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                // Add request ID for tracking
                config.headers['X-Request-ID'] = this.generateRequestId();

                // Add timestamp
                config.headers['X-Request-Time'] = new Date().toISOString();

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => {
                // Log successful requests in development
                if (process.env.NODE_ENV === 'development') {
                    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
                        status: response.status,
                        data: response.data,
                        requestId: response.config.headers['X-Request-ID']
                    });
                }

                return response;
            },
            (error) => {
                const { response, config } = error;

                // Log errors in development
                if (process.env.NODE_ENV === 'development') {
                    console.error(`❌ ${config?.method?.toUpperCase()} ${config?.url}`, {
                        status: response?.status,
                        data: response?.data,
                        requestId: config?.headers['X-Request-ID']
                    });
                }

                // Handle different error types
                if (response?.status === 401) {
                    this.handleUnauthorized();
                } else if (response?.status === 403) {
                    toast.error('Access denied');
                } else if (response?.status === 404) {
                    toast.error('Resource not found');
                } else if (response?.status >= 500) {
                    toast.error('Server error. Please try again later.');
                } else if (error.code === 'NETWORK_ERROR') {
                    toast.error('Network error. Check your connection.');
                }

                return Promise.reject(error);
            }
        );
    }

    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    handleUnauthorized() {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
    }

    // User endpoints
    async login(credentials) {
        const response = await this.client.post('/users/login', credentials);
        return response.data;
    }

    async signup(userData) {
        const response = await this.client.post('/users/signup', userData);
        return response.data;
    }

    async getUserProfile() {
        const response = await this.client.get('/users/profile');
        return response.data;
    }

    async updateUserProfile(updates) {
        const response = await this.client.put('/users/profile', updates);
        return response.data;
    }

    async getUserStats(userId) {
        const response = await this.client.get(`/users/${userId}/stats`);
        return response.data;
    }

    // Restaurant endpoints
    async getRestaurants(params = {}) {
        const response = await this.client.get('/restaurants', { params });
        return response.data;
    }

    async getRestaurant(id) {
        const response = await this.client.get(`/restaurants/${id}`);
        return response.data;
    }

    async searchRestaurants(query, filters = {}) {
        const response = await this.client.post('/restaurants/search', {
            query,
            filters
        });
        return response.data;
    }

    async getRestaurantsByLocation(lat, lng, radius = 10) {
        const response = await this.client.get('/restaurants/nearby', {
            params: { lat, lng, radius }
        });
        return response.data;
    }

    // Review endpoints
    async getReviews(params = {}) {
        const response = await this.client.get('/reviews', { params });
        return response.data;
    }

    async getReview(id) {
        const response = await this.client.get(`/reviews/${id}`);
        return response.data;
    }

    async createReview(reviewData) {
        const response = await this.client.post('/reviews', reviewData);
        return response.data;
    }

    async updateReview(id, updates) {
        const response = await this.client.put(`/reviews/${id}`, updates);
        return response.data;
    }

    async deleteReview(id) {
        const response = await this.client.delete(`/reviews/${id}`);
        return response.data;
    }

    async likeReview(id) {
        const response = await this.client.post(`/reviews/${id}/like`);
        return response.data;
    }

    async getReviewsByRestaurant(restaurantId, params = {}) {
        const response = await this.client.get(`/restaurants/${restaurantId}/reviews`, { params });
        return response.data;
    }

    // Upload endpoints
    async uploadImage(file, type = 'general') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const response = await this.client.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    // Analytics endpoints
    async getUserAnalytics(userId, timeRange = '30d') {
        const response = await this.client.get(`/analytics/users/${userId}`, {
            params: { timeRange }
        });
        return response.data;
    }

    async getRestaurantAnalytics(restaurantId, timeRange = '30d') {
        const response = await this.client.get(`/analytics/restaurants/${restaurantId}`, {
            params: { timeRange }
        });
        return response.data;
    }

    // Notification endpoints
    async getNotifications() {
        const response = await this.client.get('/notifications');
        return response.data;
    }

    async markNotificationRead(id) {
        const response = await this.client.put(`/notifications/${id}/read`);
        return response.data;
    }

    // Social endpoints
    async followUser(userId) {
        const response = await this.client.post(`/users/${userId}/follow`);
        return response.data;
    }

    async unfollowUser(userId) {
        const response = await this.client.delete(`/users/${userId}/follow`);
        return response.data;
    }

    async getFollowers(userId) {
        const response = await this.client.get(`/users/${userId}/followers`);
        return response.data;
    }

    async getFollowing(userId) {
        const response = await this.client.get(`/users/${userId}/following`);
        return response.data;
    }
}

export const apiClient = new APIClient();
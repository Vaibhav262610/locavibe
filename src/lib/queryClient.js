import { QueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 10 * 60 * 1000, // 10 minutes
            retry: (failureCount, error) => {
                if (error.status === 404 || error.status === 403) {
                    return false;
                }
                return failureCount < 3;
            },
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
        mutations: {
            onError: (error) => {
                toast.error(error.message || 'Something went wrong');
            },
        },
    },
});

// Query keys factory
export const queryKeys = {
    all: ['locavibe'] as const,

    // User queries
    users: () => [...queryKeys.all, 'users'] as const,
    user: (id: string) => [...queryKeys.users(), id] as const,
    userProfile: () => [...queryKeys.users(), 'profile'] as const,
    userStats: (id: string) => [...queryKeys.user(id), 'stats'] as const,

    // Restaurant queries
    restaurants: () => [...queryKeys.all, 'restaurants'] as const,
    restaurant: (id: string) => [...queryKeys.restaurants(), id] as const,
    restaurantsByLocation: (lat: number, lng: number, radius: number) =>
        [...queryKeys.restaurants(), 'location', { lat, lng, radius }] as const,
    restaurantsByFilters: (filters: object) =>
        [...queryKeys.restaurants(), 'filters', filters] as const,

    // Review queries
    reviews: () => [...queryKeys.all, 'reviews'] as const,
    review: (id: string) => [...queryKeys.reviews(), id] as const,
    reviewsByRestaurant: (restaurantId: string) =>
        [...queryKeys.reviews(), 'restaurant', restaurantId] as const,
    reviewsByUser: (userId: string) =>
        [...queryKeys.reviews(), 'user', userId] as const,

    // Search queries
    search: () => [...queryKeys.all, 'search'] as const,
    searchRestaurants: (query: string, filters: object) =>
        [...queryKeys.search(), 'restaurants', query, filters] as const,
    searchSuggestions: (query: string) =>
        [...queryKeys.search(), 'suggestions', query] as const,

    // Analytics queries
    analytics: () => [...queryKeys.all, 'analytics'] as const,
    userAnalytics: (userId: string) =>
        [...queryKeys.analytics(), 'user', userId] as const,
    restaurantAnalytics: (restaurantId: string) =>
        [...queryKeys.analytics(), 'restaurant', restaurantId] as const,
};
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAppStore = create(
    subscribeWithSelector(
        persist(
            (set, get) => ({
                // User state
                user: null,
                isAuthenticated: false,

                // UI state
                theme: 'dark',
                sidebarOpen: false,
                notifications: [],

                // Search state
                searchQuery: '',
                searchFilters: {
                    cuisine: [],
                    priceRange: [0, 100],
                    rating: 0,
                    distance: 10,
                    isOpen: false
                },
                searchResults: [],
                searchHistory: [],

                // Restaurant state
                restaurants: [],
                favoriteRestaurants: [],
                visitedRestaurants: [],

                // Review state
                reviews: [],
                userReviews: [],

                // Real-time state
                onlineUsers: [],
                liveUpdates: [],

                // Analytics state
                userStats: {
                    totalReviews: 0,
                    totalLikes: 0,
                    profileViews: 0,
                    followersCount: 0,
                    followingCount: 0
                },

                // Actions
                setUser: (user) => set({ user, isAuthenticated: !!user }),

                logout: () => set({
                    user: null,
                    isAuthenticated: false,
                    userReviews: [],
                    favoriteRestaurants: [],
                    visitedRestaurants: []
                }),

                toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

                addNotification: (notification) => set((state) => ({
                    notifications: [
                        ...state.notifications,
                        {
                            id: Date.now(),
                            timestamp: new Date().toISOString(),
                            read: false,
                            ...notification
                        }
                    ]
                })),

                markNotificationRead: (id) => set((state) => ({
                    notifications: state.notifications.map(n =>
                        n.id === id ? { ...n, read: true } : n
                    )
                })),

                clearNotifications: () => set({ notifications: [] }),

                setSearchQuery: (query) => set({ searchQuery: query }),

                updateSearchFilters: (filters) => set((state) => ({
                    searchFilters: { ...state.searchFilters, ...filters }
                })),

                addToSearchHistory: (query) => set((state) => ({
                    searchHistory: [
                        query,
                        ...state.searchHistory.filter(q => q !== query)
                    ].slice(0, 10)
                })),

                setSearchResults: (results) => set({ searchResults: results }),

                addToFavorites: (restaurantId) => set((state) => ({
                    favoriteRestaurants: [...state.favoriteRestaurants, restaurantId]
                })),

                removeFromFavorites: (restaurantId) => set((state) => ({
                    favoriteRestaurants: state.favoriteRestaurants.filter(id => id !== restaurantId)
                })),

                addVisitedRestaurant: (restaurantId) => set((state) => ({
                    visitedRestaurants: [...new Set([...state.visitedRestaurants, restaurantId])]
                })),

                updateUserStats: (stats) => set((state) => ({
                    userStats: { ...state.userStats, ...stats }
                })),

                addReview: (review) => set((state) => ({
                    reviews: [review, ...state.reviews],
                    userReviews: review.userId === state.user?.id
                        ? [review, ...state.userReviews]
                        : state.userReviews
                })),

                updateReview: (reviewId, updates) => set((state) => ({
                    reviews: state.reviews.map(r => r.id === reviewId ? { ...r, ...updates } : r),
                    userReviews: state.userReviews.map(r => r.id === reviewId ? { ...r, ...updates } : r)
                })),

                setOnlineUsers: (users) => set({ onlineUsers: users }),

                addLiveUpdate: (update) => set((state) => ({
                    liveUpdates: [update, ...state.liveUpdates].slice(0, 50)
                })),

                // Computed values
                getRestaurantById: (id) => {
                    const state = get();
                    return state.restaurants.find(r => r.id === id);
                },

                getReviewsByRestaurant: (restaurantId) => {
                    const state = get();
                    return state.reviews.filter(r => r.restaurantId === restaurantId);
                },

                getUnreadNotificationsCount: () => {
                    const state = get();
                    return state.notifications.filter(n => !n.read).length;
                }
            }),
            {
                name: 'locavibe-store',
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({
                    user: state.user,
                    isAuthenticated: state.isAuthenticated,
                    theme: state.theme,
                    searchHistory: state.searchHistory,
                    favoriteRestaurants: state.favoriteRestaurants,
                    visitedRestaurants: state.visitedRestaurants
                })
            }
        )
    )
);

export default useAppStore;
import { NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile']; // Add your protected routes

export function middleware(req) {
    const token = req.cookies.get('token')?.value || req.cookies.get('authToken')?.value; // Check for both token and authToken

    // If the route is protected and the user is not authenticated, redirect to login
    if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/discover', '/profile', '/confirm-attendance', '/scan', '/attendance-marked', '/community', '/event-dashboard'], // Specify the paths you want to protect
};

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const protectedRoutes = ['/discover', '/profile', '/write-review', '/my-reviews', '/saved', '/admin'];

export function middleware(req) {
    const token = req.cookies.get('token')?.value || req.cookies.get('authToken')?.value;
    const pathname = req.nextUrl.pathname;

    // Check if the current route is protected
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute) {
        if (!token) {
            // No token found, redirect to login
            return NextResponse.redirect(new URL('/login', req.url));
        }

        try {
            // Verify token validity
            jwt.verify(token, process.env.TOKEN_SECRET);
        } catch (error) {
            // Invalid token, redirect to login
            const response = NextResponse.redirect(new URL('/login', req.url));
            // Clear invalid token
            response.cookies.delete('token');
            response.cookies.delete('authToken');
            return response;
        }
    }

    // Add security headers
    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
}

export const config = {
    matcher: [
        '/discover/:path*',
        '/profile/:path*',
        '/write-review/:path*',
        '/my-reviews/:path*',
        '/saved/:path*',
        '/admin/:path*',
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};

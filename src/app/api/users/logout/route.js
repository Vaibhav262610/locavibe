import { connectDb } from '@/db/db';
import { NextResponse } from 'next/server';

connectDb();

export async function GET(request) {
    try {
        // Check if the user is already logged out (no token in cookies)
        const token = request.cookies.get('token')?.value && request.cookies.get('authToken')?.value;
        if (!token && !authToken) {
            return NextResponse.json(
                { message: 'USER ALREADY LOGGED OUT', success: false },
                { status: 400 }
            );
        }
        const clearAuthCookies = () => {
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          };
        clearAuthCookies()          
        localStorage.removeItem("authToken");

        // Clear the token by setting an expired cookie
        const response = NextResponse.json({
            message: 'LOGGED OUT SUCCESSFULLY',
            success: true,
        });

        response.headers.set('Set-Cookie', 'token=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure');

        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

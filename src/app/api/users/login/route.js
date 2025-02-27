import { connectDb } from '@/db/db';
import User from '@/models/user.models.js';
import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectDb();

export async function POST(request) {
    try {
        const token = request.cookies.get('token')?.value;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
                return NextResponse.json(
                    { message: 'USER ALREADY LOGGED IN', success: false },
                    { status: 403 }
                );
            } catch (err) {
                console.error('Token verification failed:', err);
            }
        }

        const reqBody = await request.json();
        const { email, password } = reqBody;
        console.log('Request Body:', reqBody);

        const user = await User.findOne({ email });
        if (!user) {
            console.error('User not found');
            return NextResponse.json({ error: 'USER DOES NOT EXIST' }, { status: 404 });
        }

        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            console.error('Invalid password');
            return NextResponse.json({ error: 'INVALID CREDENTIALS' }, { status: 401 });
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        };

        const newToken = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
            expiresIn: '1m', // Token expires in 30 minutes
        });

        const response = new NextResponse(
            JSON.stringify({
                message: 'LOGGED IN SUCCESS',
                success: true,
                token: newToken, // Send token in response (for localStorage)
                redirectTo: '/discover',
            }),
            {
                status: 200,
                headers: {
                    'Set-Cookie': `token=${newToken}; HttpOnly; Path=/; Max-Age=1800; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`, // Cookie valid for 30 mins
                    'Content-Type': 'application/json',
                },
            }
        );
        return response;
    } catch (error) {
        console.error('Error during login process:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { connectDb } from '@/db/db';
import User from '@/models/user.models';
import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';

connectDb();

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;
        console.log('Received request body:', reqBody);

        const user = await User.findOne({ email });

        if (user) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 } // Changed from 500 to 400 (Bad Request)
            );
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        console.log('Saved user:', savedUser);

        return NextResponse.json({
            message: 'User registered successfully',
            success: true,
            savedUser,
        });
    } catch (error) {
        console.error('Error in registration:', error); // Improved logging
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

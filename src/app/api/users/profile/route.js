import { connectDb } from '@/db/db';
import User from '@/models/user.models';
import { NextResponse } from 'next/server';
import { getDataFromToken } from '@/helpers/getDataFromToken';

connectDb();

export async function GET(request) {
    try {
        // Get user ID from the token
        const userId = await getDataFromToken(request);

        if (!userId) {
            return NextResponse.json({ message: 'INVALID TOKEN' }, { status: 401 });
        }

        // Find user by _id and exclude password
        const user = await User.findOne({ _id: userId }).select('-password');

        if (!user) {
            return NextResponse.json({ message: 'USER NOT FOUND' }, { status: 404 });
        }

        return NextResponse.json({ message: 'USER FOUND', data: user });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

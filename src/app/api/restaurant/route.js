import { connectDb } from '@/db/db';
import Restaurant from '@/models/Restaurant';

export async function POST(req) {
    try {
        await connectDb();
        const body = await req.json();
        const newRestaurant = new Restaurant(body);
        await newRestaurant.save();

        return new Response(JSON.stringify({ success: true, data: newRestaurant }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function GET() {
    try {
        await connectDb();
        const restaurants = await Restaurant.find();
        return new Response(JSON.stringify({ success: true, data: restaurants }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
import mongoose from 'mongoose';

let isConnected = false;

export async function connectDb() {
    // If already connected, return
    if (isConnected) {
        console.log('MongoDB already connected');
        return;
    }

    try {
        // Validate MongoDB URI
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        console.log('Attempting to connect to MongoDB...');

        // Connect with simplified, compatible options
        await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        const connection = mongoose.connection;
        isConnected = true;

        connection.on('connected', () => {
            console.log('✅ MONGODB CONNECTED SUCCESSFULLY');
            console.log(`📍 Connected to database: ${connection.name}`);
        });

        connection.on('error', (err) => {
            console.error('❌ ERROR IN MONGODB CONNECTION:', err);
            isConnected = false;
        });

        connection.on('disconnected', () => {
            console.log('⚠️ MONGODB DISCONNECTED');
            isConnected = false;
        });

        // Handle process termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('🔌 MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ SOMETHING WENT WRONG IN CONNECTING TO MONGODB:');
        console.error('Error details:', error.message);

        // Provide helpful error messages
        if (error.message.includes('ENOTFOUND')) {
            console.error('🔍 DNS Resolution failed. Please check:');
            console.error('   1. Your internet connection');
            console.error('   2. MongoDB Atlas cluster URL is correct');
            console.error('   3. Your IP address is whitelisted in MongoDB Atlas');
        } else if (error.message.includes('authentication failed')) {
            console.error('🔐 Authentication failed. Please check:');
            console.error('   1. Username and password are correct');
            console.error('   2. Database user has proper permissions');
        }

        isConnected = false;
        throw error;
    }
}

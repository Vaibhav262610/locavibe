import mongoose from 'mongoose';

// Fallback database configuration for development
export const dbConfig = {
    // Try MongoDB Atlas first, then local MongoDB
    getConnectionString() {
        const mongoUri = process.env.MONGODB_URI;

        // If no MongoDB URI is provided, use local MongoDB
        if (!mongoUri || mongoUri.includes('username:password')) {
            console.log('⚠️ Using local MongoDB fallback');
            return 'mongodb://localhost:27017/locavibe';
        }

        return mongoUri;
    },

    // Connection options optimized for both local and cloud
    getConnectionOptions() {
        const isLocal = this.getConnectionString().includes('localhost');

        if (isLocal) {
            return {
                maxPoolSize: 5,
                serverSelectionTimeoutMS: 3000,
                socketTimeoutMS: 30000,
            };
        }

        return {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
            bufferMaxEntries: 0
        };
    }
};

// Enhanced connection function with fallback
export async function connectDbWithFallback() {
    let connectionString = dbConfig.getConnectionString();
    let connectionOptions = dbConfig.getConnectionOptions();

    try {
        console.log('🔄 Attempting primary database connection...');
        await mongoose.connect(connectionString, connectionOptions);
        console.log('✅ Connected to MongoDB successfully');
        return true;
    } catch (error) {
        console.error('❌ Primary connection failed:', error.message);

        // If Atlas connection fails, try local MongoDB
        if (!connectionString.includes('localhost')) {
            console.log('🔄 Trying local MongoDB fallback...');

            try {
                connectionString = 'mongodb://localhost:27017/locavibe';
                connectionOptions = {
                    maxPoolSize: 5,
                    serverSelectionTimeoutMS: 3000,
                    socketTimeoutMS: 30000,
                };

                await mongoose.connect(connectionString, connectionOptions);
                console.log('✅ Connected to local MongoDB');
                return true;
            } catch (localError) {
                console.error('❌ Local MongoDB connection also failed:', localError.message);
            }
        }

        // If all connections fail, provide helpful guidance
        console.error('\n🆘 Database Connection Help:');
        console.error('1. For MongoDB Atlas: Check your connection string in .env');
        console.error('2. For local MongoDB: Install and start MongoDB locally');
        console.error('3. Run "npm run test:db" to diagnose connection issues');
        console.error('4. See MONGODB_SETUP.md for detailed setup instructions\n');

        throw error;
    }
}
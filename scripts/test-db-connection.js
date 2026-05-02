#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(color, message) {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testDatabaseConnection() {
    log('cyan', '🔍 Testing MongoDB Connection...\n');

    // Check if MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
        log('red', '❌ MONGODB_URI not found in environment variables');
        log('yellow', '💡 Please check your .env file');
        process.exit(1);
    }

    // Mask the password in the URI for logging
    const maskedUri = process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
    log('blue', `📡 Attempting to connect to: ${maskedUri}`);

    try {
        // Test connection
        log('yellow', '⏳ Connecting to MongoDB...');

        await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        log('green', '✅ MongoDB connection successful!');
        log('blue', `📍 Connected to database: ${mongoose.connection.name}`);
        log('blue', `🏠 Host: ${mongoose.connection.host}`);
        log('blue', `🔌 Port: ${mongoose.connection.port}`);

        // Test database operations
        log('yellow', '⏳ Testing database operations...');

        // Create a test schema
        const TestSchema = new mongoose.Schema({
            name: String,
            timestamp: { type: Date, default: Date.now },
            testData: Object
        });

        const TestModel = mongoose.model('ConnectionTest', TestSchema);

        // Test write operation
        log('yellow', '📝 Testing write operation...');
        const testDoc = new TestModel({
            name: 'Connection Test',
            testData: {
                version: '1.0.0',
                features: ['advanced-ui', 'real-time', '3d-visualization'],
                timestamp: new Date().toISOString()
            }
        });

        await testDoc.save();
        log('green', '✅ Write operation successful!');

        // Test read operation
        log('yellow', '📖 Testing read operation...');
        const foundDoc = await TestModel.findOne({ name: 'Connection Test' });
        if (foundDoc) {
            log('green', '✅ Read operation successful!');
            log('blue', `📄 Document ID: ${foundDoc._id}`);
        }

        // Test update operation
        log('yellow', '✏️ Testing update operation...');
        await TestModel.updateOne(
            { name: 'Connection Test' },
            { $set: { 'testData.updated': true } }
        );
        log('green', '✅ Update operation successful!');

        // Test delete operation
        log('yellow', '🗑️ Testing delete operation...');
        await TestModel.deleteOne({ name: 'Connection Test' });
        log('green', '✅ Delete operation successful!');

        // Clean up test collection
        await TestModel.collection.drop().catch(() => {
            // Ignore error if collection doesn't exist
        });

        log('green', '\n🎉 All database tests passed successfully!');
        log('cyan', '🚀 Your MongoDB connection is ready for LocaVibe!');

        // Test existing collections
        log('yellow', '\n📊 Checking existing collections...');
        const collections = await mongoose.connection.db.listCollections().toArray();

        if (collections.length > 0) {
            log('blue', '📁 Existing collections:');
            collections.forEach(collection => {
                log('blue', `   - ${collection.name}`);
            });
        } else {
            log('yellow', '📁 No existing collections found (this is normal for a new database)');
        }

        // Performance test
        log('yellow', '\n⚡ Running performance test...');
        const startTime = Date.now();

        const PerfTestSchema = new mongoose.Schema({ data: String });
        const PerfTestModel = mongoose.model('PerfTest', PerfTestSchema);

        // Insert multiple documents
        const docs = Array.from({ length: 100 }, (_, i) => ({
            data: `Performance test document ${i}`
        }));

        await PerfTestModel.insertMany(docs);
        const insertTime = Date.now() - startTime;

        // Query documents
        const queryStartTime = Date.now();
        const results = await PerfTestModel.find({}).limit(10);
        const queryTime = Date.now() - queryStartTime;

        // Clean up
        await PerfTestModel.collection.drop();

        log('green', `✅ Performance test completed:`);
        log('blue', `   - Insert 100 docs: ${insertTime}ms`);
        log('blue', `   - Query 10 docs: ${queryTime}ms`);

    } catch (error) {
        log('red', '\n❌ Database connection failed!');
        log('red', `Error: ${error.message}`);

        // Provide specific troubleshooting advice
        if (error.message.includes('ENOTFOUND')) {
            log('yellow', '\n🔍 DNS Resolution Issue Detected:');
            log('yellow', '   1. Check your internet connection');
            log('yellow', '   2. Verify your MongoDB Atlas cluster URL');
            log('yellow', '   3. Ensure your IP is whitelisted in MongoDB Atlas');
            log('yellow', '   4. Try using a different network (mobile hotspot)');
        } else if (error.message.includes('authentication failed')) {
            log('yellow', '\n🔐 Authentication Issue Detected:');
            log('yellow', '   1. Check your username and password');
            log('yellow', '   2. Ensure the database user exists in MongoDB Atlas');
            log('yellow', '   3. Verify user has readWrite permissions');
        } else if (error.message.includes('timeout')) {
            log('yellow', '\n⏰ Timeout Issue Detected:');
            log('yellow', '   1. Check your firewall settings');
            log('yellow', '   2. Verify network connectivity');
            log('yellow', '   3. Try increasing timeout values');
        }

        log('cyan', '\n📖 For detailed setup instructions, see: MONGODB_SETUP.md');
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        log('blue', '\n🔌 Database connection closed');
    }
}

// Handle process termination
process.on('SIGINT', async () => {
    log('yellow', '\n⚠️ Process interrupted');
    await mongoose.connection.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    log('yellow', '\n⚠️ Process terminated');
    await mongoose.connection.close();
    process.exit(0);
});

// Run the test
testDatabaseConnection().catch(error => {
    log('red', `\n💥 Unexpected error: ${error.message}`);
    process.exit(1);
});
import mongoose from 'mongoose';

export async function connectDb() {
    try {
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MONGODB CONNECTED SUCCESSFULLY');
        });

        connection.on('error', (err) => {
            console.log('ERROR IN MONGODB CONNECTION' + err);
            process.exit();
        });
    } catch (error) {
        console.log('SOMETHING WENT WRONG IN CONNECTING TO MONDO DB');
        console.log(error);
    }
}

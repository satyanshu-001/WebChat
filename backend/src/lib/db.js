import dns from 'node:dns';
import mongoose from 'mongoose';
import { ENV } from './env.js';

// Force Google DNS — fixes "querySrv ECONNREFUSED" on some local networks
if (ENV.NODE_ENV !== 'production') {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}

export const connectDB = async () => {
    try {
        const {MONGO_URI} = ENV;
        if(!MONGO_URI){
            throw new Error('MONGO_URI is not set');
        }


        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected: ' , conn.connection.host);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // 1 status code means fail, 0 means success
    }
}
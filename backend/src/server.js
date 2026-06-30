import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser'
import cors from 'cors'



import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import { ENV } from './lib/env.js';
import { app, server } from './lib/socket.js';
import './lib/cron.js'; // keep-alive ping for Render free tier



import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = ENV.PORT || 3000; 

app.use(express.json({ limit: '5mb' })); // allow base64 profile image payloads
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser())

app.get("/health", (_req, res) => {
  res.json({ status: "ok"});
});

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// make ready for production
if (ENV.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../frontend/dist')));

    app.get('*', (_ , res) => {
        res.sendFile(path.join(__dirname, '../../frontend','dist','index.html'));
    });
}


server.listen(PORT,() => {
    console.log(`server is running on port ${PORT}`)
    connectDB();
});
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import questionRoutes from './routes/questions.js';

import testRoutes from './routes/tests.js';
import resultRoutes from './routes/results.js';
import userRoutes from './routes/users.js';


import 'dotenv/config';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});



app.use(cors({
    origin: "*",
}));
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/users', userRoutes);
app.use('/uploads', express.static('uploads'));
app.use((req, res, next) => {
    console.log("REQ:", req.method, req.url, req.body);
    next();
});

app.get("/test", (req, res) => {
    console.log("HIT");
    res.send("OK");
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-test', (testId) => {
        socket.join(testId);
        console.log(`User ${socket.id} joined test ${testId}`);
    });

    socket.on('time-update', (data) => {
        socket.to(data.testId).emit('time-update', data);
    });

    socket.on('test-submitted', (data) => {
        socket.to(data.testId).emit('test-submitted', data);
    });

});


export { app, io, server };

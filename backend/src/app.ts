import dotenv from 'dotenv';
dotenv.config();

import connectDB from './database/mongoDB';
import userRouter from './routes/userRoutes';
import adminRouter from './routes/adminRoutes';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import hostRouter from './routes/hostRoutes';
import otpRouter from './routes/otpRoutes';
import morgan from 'morgan';
import logger from './utils/logger';
import orderRouter from './routes/orderRoutes';
import walletRouter from './routes/walletRoutes';
import offerRouter from './routes/offerRoutes';
import chatRouter from './routes/chatRoutes';
import {app,server} from './socket/socket'
import feedbackRouter from './routes/feedBackRoutes';
import messageRouter from './routes/messageRoutes';


const corsOptions = {
  origin: "*",
  credentials: true,
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

connectDB();

//middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Routes 
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/bike', hostRouter);
app.use('/api/otp', otpRouter)
app.use('/api/order', orderRouter)
app.use('/api/wallet', walletRouter)
app.use('/api/offer',offerRouter)
app.use('/api/feedback',feedbackRouter)

app.use('/api/chat',chatRouter)
app.use('/api/chat',messageRouter)

const port = process.env.PORT || 2000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});





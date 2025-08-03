import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

const app = express();
const server = createServer(app);


// initialize Socket.IO
const io = new Server(server, {    
    pingTimeout: 60000, 
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        credentials: true,
    },
});


interface ActiveUsersType {
    userId: string;
    socketId: string;
}

let activeUsers = [] as ActiveUsersType[]

// Socket.IO Connections
io.on("connection", (socket) => {
    console.log('a user connected', socket.id);

    socket.on("setup", (userId) => {   
        socket.join(userId);  
        socket.emit("connected");
        if (!activeUsers.some((user) => user.userId === userId)) {
            activeUsers.push({ userId: userId, socketId: socket.id })
        }
        io.emit('get-users', activeUsers)
    });

    // joining a chat
    socket.on("join chat", (room) => { 
        socket.join(room);
        console.log("user joined Room: ", room);
    }); 

    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    // sending messages
    socket.on("message", (message) => {
        console.log("Message received:", message);

        let chat = message.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user: any) => {
            console.log(1, user);
            console.log(2, message.sender._id);

            if (user._id !== message.sender._id) {
                console.log(98, message);
                socket.to(user._id).emit("message received", message); // send the message to others
            }
        });
    });

    // handling disconnection
    socket.on("disconnect", () => {
        console.log("user disconnected");
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
        io.emit('get-users', activeUsers)
    });

    socket.on("offline", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
        io.emit('get-users', activeUsers)
    })


});


export { app, io, server };
import express from 'express';
import chatRepository from '../repositories/chatRepository';
import chatServices from '../services/chatServices';
import ChatController from '../controllers/chatController';
import userAuth from '../Middleware/userAuthMiddleware';


const chatRep = new chatRepository()
const chatSer = new chatServices(chatRep)
const chatController = new ChatController(chatSer)


const chatRouter = express.Router();

chatRouter
    .get('/getchat',userAuth, (req, res) => { chatController.getChat(req,res) })
    .post('/accesschat',userAuth,(req, res) => { chatController.accessChat(req,res) })
    

export default chatRouter;

import express from 'express';
import messageRepository from '../repositories/messageRepository';
import messageServices from '../services/messageServices';
import MessageController from '../controllers/messageController';
import userAuth from '../Middleware/userAuthMiddleware';
import chatRepository from '../repositories/chatRepository';


const messageRep = new messageRepository()
const chatRep = new chatRepository()
const messageSer = new messageServices(messageRep,chatRep)
const messageController = new MessageController(messageSer)


const messageRouter = express.Router();


messageRouter
   .post('/sendmessage',userAuth,(req,res)=>{ messageController.sendMessage(req,res) })
   .get('/getallmessage',userAuth,(req,res)=>{ messageController.getMessage(req,res) })


  

export default messageRouter;

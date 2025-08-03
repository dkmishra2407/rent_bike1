import express from 'express';
import orderRepository from '../repositories/orderRepository';
import orderServices from '../services/orderServices';
import OrderController from '../controllers/orderController';
import userAuth from '../Middleware/userAuthMiddleware';
import walletRepository from '../repositories/walletRepository';
import UserRepository from '../repositories/userRepository';
import walletServices from '../services/walletServices';
import UserServices from '../services/userServices';

const walletRep = new walletRepository()
const userRep = new UserRepository()

const walletSer = new walletServices(walletRep)
const userSer = new UserServices(userRep)

const OrderRepository = new orderRepository()
const orderService = new orderServices(OrderRepository)
const orderController = new OrderController(orderService,walletSer,userSer)

const orderRouter = express.Router()

orderRouter
    .post('/createOrder', userAuth, (req, res) => { orderController.createOrder(req, res) })
    .post('/placeOrder', userAuth, (req, res) => { orderController.saveOrder(req, res) })
    .put('/completeOrder/:orderId',userAuth,(req,res)=>{orderController.completeOrder(req,res)})
    .post('/conform_order/:')

export default orderRouter;


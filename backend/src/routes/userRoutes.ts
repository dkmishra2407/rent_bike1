import express from 'express';
import { UserController } from '../controllers/userController';
import UserServices from '../services/userServices';
import UserRepository from '../repositories/userRepository';
import upload from '../config/multer';
import userAuth from '../Middleware/userAuthMiddleware';
import multer from 'multer';
import OtpRepository from '../repositories/otpRepository';
import OtpServices from '../services/otpServices';
import morgan from 'morgan';
import logger from '../utils/logger';



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const uploads = multer({ storage });



const otpRepository = new OtpRepository();
const userRepository = new UserRepository()

const service = new UserServices(userRepository)
const otpService = new OtpServices(otpRepository)
const userController = new UserController(service, otpService)

const userRouter = express.Router();

userRouter.use(
    morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim()),
        },
    })
);

userRouter
    .post('/userSignup', (req, res) => { userController.userSignup(req, res) })
    .post('/login', (req, res) => { userController.login(req, res) })
    .put('/logout', (req, res) => { userController.logout(req, res); })
    .post('/forgotPassword', (req, res) => { userController.forgotPassword(req, res); })
    .get('/getProfile', userAuth, (req, res) => { userController.getProfile(req, res); })
    .put('/editUser', userAuth, upload.single('profile_picture'), (req, res) => { userController.editUser(req, res); })
    .put('/editUserDocuments', userAuth, uploads.fields([{ name: 'frontImage' }, { name: 'backImage' }]), (req, res) => { userController.editUserDocuments(req, res); })
    .get('/getAllBikes', (req, res) => { userController.GetBikeList(req, res); })
    .get('/getBikeDeatils/:id', (req, res) => { userController.getBikeDetails(req, res); })
    .post('/checkBlockedStatus', (req, res) => { userController.checkBlockedStatus(req, res) })
    .get('/orderList', userAuth, (req, res) => { userController.getOrderList(req, res) })
    .get('/OrderDetails/:orderId', userAuth, (req, res) => { userController.getOrderDetails(req, res) })
    .put('/earlyReturns/:orderId', userAuth, (req, res) => { userController.earlyReturn(req, res) })
    .put('/returnOrder/:orderId', userAuth, (req, res) => { userController.returnOrder(req, res) })
    .post('/submitReview', userAuth, (req, res) => { userController.submitReview(req, res) })
    .get('/getReviews/:bikeId', (req, res) => { userController.getReviews(req, res) })
    .get('/isAlreadyBooked/:bikeId', userAuth, (req, res) => { userController.isBikeAlreadyBooked(req, res) })


export default userRouter;
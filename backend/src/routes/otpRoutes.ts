import express from 'express';
import OtpController from '../controllers/otpController';
import OtpServices from '../services/otpServices';
import OtpRepository from '../repositories/otpRepository';

const otpRepository = new OtpRepository();
const service = new OtpServices(otpRepository)
const otpController = new OtpController(service)
const otpRouter = express.Router();
console.log(1234);

otpRouter
  .post('/verifyOtp', (req, res) => { otpController.verifyOtp(req, res); })
  .post('/resendOtp', (req, res) => { otpController.resendOtp(req, res); });


export default otpRouter;

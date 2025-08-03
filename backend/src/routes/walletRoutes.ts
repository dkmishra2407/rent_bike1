import express from 'express';
import walletRepository from '../repositories/walletRepository';
import walletServices from '../services/walletServices';
import WalletController from '../controllers/walletController';

const walletrepository = new walletRepository()
const walletservice = new walletServices(walletrepository)
const walletController = new WalletController(walletservice)


const walletRouter = express.Router();

walletRouter
    .get('/getWallet/:walletId', (req, res) => { walletController.getWallet(req, res) })




export default walletRouter;

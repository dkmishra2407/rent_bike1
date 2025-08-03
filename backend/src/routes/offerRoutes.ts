import express from 'express';
import offerRepository from '../repositories/offerRepository';
import offerServices from '../services/offerServices';
import OfferController from '../controllers/offerController';
import userAuth from '../Middleware/userAuthMiddleware';


const offerRep = new offerRepository()
const offerSer = new offerServices(offerRep)
const offerController = new OfferController(offerSer)

const offerRouter = express.Router()

offerRouter
    .post('/Offer', userAuth, (req, res) => { offerController.createOffer(req, res) })
    .get('/Offer', userAuth, (req, res) => { offerController.viewOffers(req, res) })
    .delete('/deleteOffer/:id', userAuth, (req, res) => { offerController.deleteOffer(req, res) })
    .put('/updateOffer/:id', userAuth, (req, res) => { offerController.updateOffer(req, res) })
    .put('/applyOffer', userAuth, (req, res) => { offerController.applyOffer(req, res) })
    .put('/removeOffer', userAuth, (req, res) => { offerController.removeOffer(req, res) })





export default offerRouter;


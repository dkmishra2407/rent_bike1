import express from 'express';
import { AdminController } from '../controllers/adminController';
import { adminAuthMiddleware } from '../Middleware/adminAuthMiddleware';
import AdminServices from '../services/adminServices';
import AdminRepository from '../repositories/adminRepository';


const repository = new AdminRepository()
const adminServices = new AdminServices(repository);
const adminController = new AdminController(adminServices);

const adminRouter = express.Router();


adminRouter
  .post('/login', (req, res) => { adminController.login(req, res) })
  .get('/logout', (req, res) => { adminController.logout(req, res) })
  .get('/getAllUsers', adminAuthMiddleware, (req, res) => { adminController.getAllUsers(req, res) })
  .get('/getSingleUser/:id', adminAuthMiddleware, (req, res) => { adminController.getSingleUser(req, res) })
  .put('/userVerify/:id', adminAuthMiddleware, (req, res) => { adminController.userVerify(req, res) })
  .put('/userBlockUnBlock/:id', adminAuthMiddleware, (req, res) => { adminController.userBlockUnBlock(req, res) })
  .get('/getAllBikeDetails', adminAuthMiddleware, (req, res) => { adminController.getAllBikeDetails(req, res) })
  .put('/verifyHost/:id', adminAuthMiddleware, (req, res) => { adminController.verifyHost(req, res) })
  .put('/isEditOn/:id', adminAuthMiddleware, (req, res) => { adminController.isEditOn(req, res) })
  .get('/orderList', adminAuthMiddleware, (req, res) => { adminController.getOrderList(req, res) })
  .get('/OrderDetails/:orderId', adminAuthMiddleware, (req, res) => { adminController.getOrderDetails(req, res) })
  .get('/getAllFeedbacks',adminAuthMiddleware,(req,res)=>{adminController.getAllFeedback(req,res)})
  .delete('/feedback/:feedbackId',adminAuthMiddleware,(req,res)=>{adminController.deleteFeedback(req,res)})




export default adminRouter;

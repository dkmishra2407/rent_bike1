import { Request, response, Response } from 'express';
import { STATUS_CODES } from "../constants/httpStatusCodes";
import IHostService from '../interfaces/bike/IBikeService';
import { ResponseModel } from '../utils/responseModel';

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = STATUS_CODES;


export class HostController {

    constructor(private HostServices: IHostService) { }

    async saveBikeDetails(req: Request, res: Response): Promise<Response | void> {
        try {
            const { insuranceExpDate, polutionExpDate } = req.body;

            if (!insuranceExpDate || !polutionExpDate) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("Insurance and Polution expiration dates are required."));
            }

            const sixMonthsFromNow = new Date();
            sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

            if (new Date(insuranceExpDate) <= sixMonthsFromNow || new Date(polutionExpDate) <= sixMonthsFromNow) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("Insurance and Polution expiration dates must be greater than six months from today's date."));
            }

            await this.HostServices.saveBikeDetails(req, res)

        } catch (error) {
            console.log(error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))
        }
    }

    async isAdminVerifyUser(req: Request, res: Response): Promise<Response | void> {
        try {
            const userId = req.query.userId as string
            const findUser = await this.HostServices.isAdminVerifyUser(userId)
            return res.status(OK).json(ResponseModel.success('Checked', { user: findUser }))

        } catch (error) {
            console.log(error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))
        }
    }

    async fetchBikeData(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.query

            if (!userId) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("User ID is required"));
            }

            const findUserAndBikes = await this.HostServices.fetchBikeData(userId as string)

            return res.status(OK).json(ResponseModel.success('', { userAndbikes: findUserAndBikes }))
        } catch (error) {
            console.error("Error fetching bike data:", error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))
        }
    }


    async bikeSingleView(req: Request, res: Response): Promise<Response> {
        try {
            const bikeId = req.query.bikeId
            if (!bikeId) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("Bike Id is required"))
            }

            const findBike = await this.HostServices.bikeSingleView(bikeId as string)
            return res.status(OK).json(ResponseModel.success('', { bike: findBike }))
        } catch (error) {
            console.error("Error fetching single bike  data:", error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))
        }
    }


    async deleteBike(req: Request, res: Response): Promise<Response> {
        try {
            const bikeId = req.query.bikeId

            if (!bikeId) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("Bike Id is required"))
            }
            await this.HostServices.deleteBike(bikeId as string)
            return res.status(OK).json(ResponseModel.success("Bike Deleted Successfully"))

        } catch (error) {
            console.error("Error deleting bike  data:", error);
            return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to delete  bike data" });
        }
    }

    async editBike(req: Request, res: Response): Promise<Response> {
        try {
            const { bikeId } = req.query;

            if (!bikeId) {
                return res.status(BAD_REQUEST).json({ success: false, message: "Bike ID is required." });
            }

            return await this.HostServices.editBike(req, res)

        } catch (error) {
            console.error("Error editing bike  data:", error);
            return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to editing  bike data" });
        }
    }


    async getOrderList(req: Request, res: Response): Promise<Response | void> {
        try {

            const { Id } = req.query;

            if (!Id) {
                return res.status(NOT_FOUND).json(ResponseModel.error("User ID is required"));
            }

            const orders = await this.HostServices.findOrder(Id.toString())

            if (!orders) {
                return res.status(OK).json(ResponseModel.success('No orders found for this user', { orders: [] }));
            }
            return res.status(OK).json(ResponseModel.success('Order List Getting Success', { order: orders || [] }))


        } catch (error) {
            console.log("error in admin controller getting order list : ", error)
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error));

        }
    }


    async getOrderDetails(req: Request, res: Response): Promise<Response | void> {
        try {

            const orderDetails = await this.HostServices.orderDetails(req.params.orderId)

            return res.status(OK).json(ResponseModel.success("Order Details Get", orderDetails))
        } catch (error) {
            console.log("error in admin controller getting order details : ", error)
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error));
        }
    }

    

}

export default HostController;


import { Request, Response } from 'express';
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { IOfferService } from '../interfaces/offer/IOfferService';
import { ResponseModel } from '../utils/responseModel';
import OfferModel from '../models/offerModel';

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = STATUS_CODES;


export class OfferController {

    constructor(private offerServices: IOfferService) { }

    async createOffer(req: Request, res: Response) {
        try {
            const { offerName, discount, startDate, endDate, description, createdBy } = req.body;

            if (!offerName || !discount || !startDate || !endDate) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("All fields except description are required."));
            }

            if (discount <= 0) {
                return res.status(BAD_REQUEST).json({ message: "Discount must be greater than 0." });
            }

            const today = new Date().toISOString().split("T")[0];
            if (startDate < today) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("Start date must be greater than today."));
            }

            if (endDate <= startDate) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("End date must be after the start date."));
            }

            const newOffer = new OfferModel({ offerName, discount, startDate, endDate, description, offerBy: createdBy });

            await this.offerServices.saveOffer(newOffer)
            return res.status(OK).json(ResponseModel.success("Offer created successfully"))
        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('Internal server error', error as Error));

        }
    }

    async viewOffers(req: Request, res: Response) {
        try {
            const userId = req.query.userId as string;
            if (!userId) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("User ID is required."));
            }
            const result = await this.offerServices.viewOffer(userId)
            return res.status(OK).json(ResponseModel.success('Get the offer list', { offer: result }))

        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('Internal server error', error as Error));
        }
    }

    async deleteOffer(req: Request, res: Response) {
        try {
            const offerId = req.params.id;

            if (!offerId) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("Offer ID is required"));
            }
            const deletedOffer = await this.offerServices.deleteOffer(offerId);

            if (!deletedOffer) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("Offer not found"));
            }

            res.status(OK).json(ResponseModel.success("Offer deleted successfully"));

        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('Internal server error', error as Error));
        }
    }


    async updateOffer(req: Request, res: Response) {
        try {
            const offerId = req.params.id;
            const updatedData = req.body;

            if (!offerId) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("Offer ID is required."));
            }

            if (!updatedData.offerName || !updatedData.discount || !updatedData.startDate || !updatedData.endDate) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("All fields except description are required."));
            }

            if (updatedData.discount <= 0) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("Discount must be greater than 0."));
            }
            const today = new Date().toISOString().split("T")[0];
            if (updatedData.startDate < today) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("Start date must be today or later."));
            }

            if (updatedData.endDate <= updatedData.startDate) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("End date must be after the start date."));
            }

            const updatedOffer = await this.offerServices.updateOffer(offerId, updatedData);
            
            if (!updatedOffer) {
                return res.status(NOT_FOUND).json(ResponseModel.error("Offer not found."));
            }

            return res.status(OK).json(ResponseModel.success("Offer updated successfully."));
        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error("Internal server error", error as Error));

        }
    }


    async applyOffer(req: Request, res: Response) {
        try {
            const { bikeId, offerId } = req.body;

            if (!bikeId || !offerId) {
                return res.status(BAD_REQUEST).json({ message: "Bike ID and Offer ID are required." });
            }            
            await this.offerServices.findBikeAndOffer(bikeId, offerId)
            return res.status(OK).json(ResponseModel.success("Bike updated successfully"))
        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error("Internal server error", error as Error));
        }
    }


    async removeOffer(req:Request,res:Response){
        try {
            const {bikeId} = req.body

            await this.offerServices.removeOffer(bikeId)

            return res.status(OK).json(ResponseModel.success("Offer remove from Bike successfully"))

        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error("Internal server error", error as Error));

        }
    }


}

export default OfferController;


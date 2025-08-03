import { Request, Response } from 'express';
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { ResponseModel } from '../utils/responseModel';
import { IFeedbackServices } from '../interfaces/feedback/IFeedbackServices';
import mongoose from 'mongoose';
import FeedbackModel from '../models/feedback';

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = STATUS_CODES;

export class FeedbackController {

    constructor(private FeedbackService: IFeedbackServices) { }

    async createFeedback(req: Request, res: Response): Promise<Response | void> {
        try {
            const { userId, rating, comment } = req.body;

            if (!userId || !rating || !comment) {
                return res.status(BAD_REQUEST).json(ResponseModel.error('Missing required fields'));
            }

            const isUserAlreadySubmitted = await this.FeedbackService.submittedAlready(userId)

            if (isUserAlreadySubmitted) {
                return res.status(BAD_REQUEST).json(ResponseModel.error('User Already submitted a feedback'))
            }

            const feedbackData = new FeedbackModel({
                userId: new mongoose.Types.ObjectId(userId),
                rating,
                feedback: comment
            });

            const createdFeedback = await this.FeedbackService.createFeedback(feedbackData);

            return res.status(OK).json(ResponseModel.success('Feedback created successfully', createdFeedback));
        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('Internal server error'))
        }
    }

    async deleteFeedback(req: Request, res: Response): Promise<Response | void> {
        try {
            const feedbackId = req.params.feedbackId
            if (!feedbackId) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("feedback id is missing"))
            }
            const deletedFeedback = await this.FeedbackService.deleteFeedback(feedbackId)
            if (!deletedFeedback) {
                return res.status(NOT_FOUND).json(ResponseModel.error("No Feedback Found"))
            }

            return res.status(OK).json(ResponseModel.success("Feedback deleted"))
        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('Internal server error'))
        }
    }

    async getMyFeedback(req: Request, res: Response): Promise<Response | void> {
        try {
            const userId = req.params.userId

            if (!userId) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("User id is missing"))
            }
            const feedback = await this.FeedbackService.myFeedback(userId)

            if (!feedback) {
                return res.status(NOT_FOUND).json(ResponseModel.error("No feedback found"));
            }
            return res.status(OK).json(ResponseModel.success('Feedback successfully get', feedback));

        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('Internal server error'))
        }
    }

    async updateFeedback(req: Request, res: Response): Promise<Response | void> {
        try {
            const { rating, comment } = req.body;
            const feedbackId = req.params.feedbackId

            const data = {
                rating: rating,
                feedback: comment
            }

            const updatedFeedback = await this.FeedbackService.updateFeedback(feedbackId, data)

            if (!updatedFeedback) {
                return res.status(NOT_FOUND).json(ResponseModel.error("Feedback not found"));
            }

            return res.status(OK).json(ResponseModel.success("Feedback updated successfully", updatedFeedback));
        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('Internal server error'))
        }
    }


    async getAllFeedback(req: Request, res: Response): Promise<Response | void> {
        try {
            const allFeedbacks = await this.FeedbackService.allFeedbacks()        
            return res.status(OK).json(ResponseModel.success('Get all feedbacks',allFeedbacks))
        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('Internal server error'))

        }
    }

    





}

export default FeedbackController;


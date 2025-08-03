import BaseRepository from './baseRepository';
import { IFeedbackRepository } from '../interfaces/feedback/IFeedbackRepository';
import FeedbackModel, { IFeedback } from '../models/feedback';
import mongoose from 'mongoose';

class feedbackRepository implements IFeedbackRepository {
  
    private feedbackRepository: BaseRepository<IFeedback>;

    constructor() {
        this.feedbackRepository = new BaseRepository(FeedbackModel);
    }

    async createFeedback(data: IFeedback): Promise<IFeedback> {
        try {
            return await this.feedbackRepository.create(data)
        } catch (error) {
            throw error
        }
    }

    async submittedAlready(userId: string): Promise<IFeedback | null> {
        try {
            return await this.feedbackRepository.findOne({userId:userId})
        } catch (error) {
            throw error
        }
    }

    async myFeedback(userId: string): Promise<IFeedback | null> {
        try {
            const  id  = new mongoose.Types.ObjectId(userId)
            return await this.feedbackRepository.findOne({userId:id})
        } catch (error) {
            throw error
        }
    }

    async deleteFeedback(id: string): Promise<IFeedback | null> {
        try {
            return await this.feedbackRepository.findByIdAndDelete(id)
        } catch (error) {
            throw error
        }
    }

    async updateFeedback(feedbackId: string, data: Partial<IFeedback>): Promise<IFeedback | null> {
        try {
            return await this.feedbackRepository.findByIdAndUpdate(feedbackId,data)
        } catch (error) {
            throw error
        }
    }

    async allFeedbacks(): Promise<IFeedback[] | null> {
        try {
            return await this.feedbackRepository.findFeedback()
        } catch (error) {
            throw error
        }
    }
}

export default feedbackRepository;
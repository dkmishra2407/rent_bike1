import { IFeedbackServices } from "../interfaces/feedback/IFeedbackServices";
import { IFeedbackRepository } from "../interfaces/feedback/IFeedbackRepository";
import { IFeedback } from "../models/feedback";


class feedbackServices implements IFeedbackServices {

    constructor(private feedbackRepository: IFeedbackRepository) { }

    async createFeedback(data: IFeedback): Promise<IFeedback> {
        try {
            return await this.feedbackRepository.createFeedback(data)
        } catch (error) {
            throw error
        }
    }

    async submittedAlready(userId: string): Promise<IFeedback | null > {
        try {
            return await this.feedbackRepository.submittedAlready(userId)
        } catch (error) {
            throw error
        }
    }

    async myFeedback(userId: string): Promise<IFeedback | null> {
        try {
            return await this.feedbackRepository.myFeedback(userId)
        } catch (error) {
            throw error
        }
    }

    async deleteFeedback(feedbackId: string): Promise<IFeedback | null> {
        try {
            return await this.feedbackRepository.deleteFeedback(feedbackId)
        } catch (error) {
            throw error
        }
    }

    async updateFeedback(feedbackId: string, data: Partial<IFeedback>): Promise<IFeedback | null> {
        try {
            return await this.feedbackRepository.updateFeedback(feedbackId,data)
        } catch (error) {
            throw error
        }
    }

    async allFeedbacks(): Promise<IFeedback[] | null> {
        try {
            return await this.feedbackRepository.allFeedbacks()
        } catch (error) {
            throw error
        }
    }

   
}

export default feedbackServices;
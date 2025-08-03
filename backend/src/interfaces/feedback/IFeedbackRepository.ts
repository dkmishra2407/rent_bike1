import { IFeedback } from "../../models/feedback";

export interface IFeedbackRepository {
    createFeedback(data: IFeedback): Promise<IFeedback>
    submittedAlready(userId: string): Promise<IFeedback | null>
    myFeedback(userId: string): Promise<IFeedback | null>
    deleteFeedback(id: string): Promise<IFeedback | null>
    updateFeedback(feedbackId: string, data: Partial<IFeedback>): Promise<IFeedback | null>;
    allFeedbacks(): Promise<IFeedback[] | null>

}

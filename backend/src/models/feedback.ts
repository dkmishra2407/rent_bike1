import mongoose, { Document, ObjectId, Schema } from 'mongoose'

export interface IFeedback extends Document {
    userId: ObjectId;
    rating: number;
    feedback: string;
}

const feedbackSchema: Schema<IFeedback> = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    feedback: {
        type: String
    },
}, { timestamps: true })

const FeedbackModel = mongoose.model<IFeedback>('Feedback', feedbackSchema)

export default FeedbackModel
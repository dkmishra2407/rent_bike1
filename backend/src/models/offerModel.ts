import mongoose, { Document, ObjectId, Schema } from 'mongoose'

export interface IOffer extends Document {
    offerName: string;
    discount: number;
    startDate: Date;
    endDate: Date;
    description: string;
    offerBy: ObjectId
}

const offerSchema: Schema<IOffer> = new mongoose.Schema({
    offerName: {
        type: String,
        require: true,
    },
    discount: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    description: {
        type: String
    },
    offerBy: {
        type: Schema.Types.ObjectId
    }


},
    { timestamps: true }
)

const OfferModel = mongoose.model<IOffer>('Offer', offerSchema)

export default OfferModel

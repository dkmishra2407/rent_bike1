import mongoose, { Schema, Document, Model } from "mongoose";
import { BikeData } from "../interfaces/BikeInterface";

const bikeSchema: Schema<BikeData> = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    modelName: {
        type: String,
        required: true,
    },
    rentAmount: {
        type: Number,
        required: true
    },
    fuelType: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: []
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isHost: {
        type: Boolean,
        default: false
    },
    isEdit: {
        type: Boolean,
        default: false
    },
    registerNumber: {
        type: String,
        required: true
    },

    insuranceExpDate: {
        type: Date,
        required: true
    },
    polutionExpDate: {
        type: Date,
        required: true
    },
    rcImage: {
        type: String,
        required: true,
        default: ''
    },
    PolutionImage: {
        type: String,
        required: true,
        default: ''
    },
    insuranceImage: {
        type: String,
        required: true,
        default: ''
    },
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer",
    },
    offerApplied: {
        type: Boolean,
        default: false,
    },
    offerPrice: {
        type: Number,
    },
    location: {
        type: String,
        required: true
    }

},
    { timestamps: true }
);
const bikeModel: Model<BikeData> = mongoose.model<BikeData>('Bike', bikeSchema);
export default bikeModel;



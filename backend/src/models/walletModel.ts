import { ObjectId } from 'mongodb'
import mongoose, { Document, Schema } from 'mongoose'

export interface IWallet extends Document {
    _id: ObjectId,
    balance: number,
    history: { date: Date; type: string; amount: number; reason: string }[];
}


const walletSchema: Schema<IWallet> = new Schema({
    balance: {
        type: Number,
        default: 0
    },
    history: [{
        date: {
            type: Date
        },
        type: {
            type: String
        },
        amount: {
            type: Number
        },
        reason: {
            type: String
        }
    }]

},
    { timestamps: true }
)


const walletModel = mongoose.model<IWallet>('Wallet', walletSchema)
export default walletModel
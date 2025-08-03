import { ObjectId } from 'mongodb'
import mongoose, { Document, Schema } from 'mongoose'

export interface IChat extends Document {
    _id: ObjectId,
    users: string[],
    latestMessage: object,
}

const chatSchema: Schema<IChat> = new Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }
},
    { timestamps: true }
)


const chatModel = mongoose.model<IChat>('Chat', chatSchema)

export default chatModel
import { ObjectId } from 'mongodb'
import mongoose, { Document, Schema } from 'mongoose'

export interface IMessage extends Document {
    _id: ObjectId,
    sender: ObjectId,
    chat: ObjectId,
    content: string
}

const messageSchema: Schema<IMessage> = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    content: {
        type: String,
        required: true
    },
},
    { timestamps: true }
)

const messageModel = mongoose.model<IMessage>('Message', messageSchema)

export default messageModel
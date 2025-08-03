import { Types } from 'mongoose'
import { IChat } from '../../models/chatModel'

export interface IChatRepository {
    checkChat(receiverId: string, senderId: string): Promise<IChat | null>
    createChat(receiverId: string, senderId: string): Promise<IChat | null>
    getChat(userId: string): Promise<IChat[] | null>
    latestMessage(chatId: string, message: Types.ObjectId): Promise<IChat | null>
}
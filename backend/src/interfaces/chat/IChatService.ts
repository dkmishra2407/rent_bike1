import { IChat } from "../../models/chatModel"

export interface IChatService {
    accessChat(receiverId: string, senderId: string): Promise<IChat | undefined | null>
    getChat(userId: string): Promise<IChat[] | undefined | null>
}
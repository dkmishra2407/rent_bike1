import { IMessage } from "../../models/messageModel"

export interface IMessageRepository {
    sendMessage(newMessage: object): Promise<IMessage | null>
    getMessage(chatId: string): Promise<IMessage[] | null>
}
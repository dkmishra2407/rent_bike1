import { IMessageService } from "../interfaces/message/IMessageService";
import { IMessageRepository } from "../interfaces/message/IMessageRepository";
import { IMessage } from "../models/messageModel";
import { Types } from "mongoose";
import { IChatRepository } from "../interfaces/chat/IChatRepository";


class messageServices implements IMessageService {

    constructor(private messageRepository: IMessageRepository,private chatRepository:IChatRepository) { }


    async sendMessage(chatId:string,senderId:string,content:string):Promise<IMessage | null | undefined> {
        try {
            const newMessage = {
                sender:senderId,
                chat:chatId,
                content
            }            
            const message = await this.messageRepository.sendMessage(newMessage)
            if(!message){
                return null
            }
            const messageId = new Types.ObjectId(message._id)
            const latestMessage = await this.chatRepository.latestMessage(chatId,messageId)
            if(!latestMessage){
                return null
            }
            return message
        } catch (error) {
            console.error('error in sending message',error);
        }
    }

    async getMessage(chatId:string):Promise<IMessage[] | null | undefined>{
        try {
            return await this.messageRepository.getMessage(chatId)
        } catch (error) {
            console.error('error while fetching message list',error);
        }
    }
}

export default messageServices;
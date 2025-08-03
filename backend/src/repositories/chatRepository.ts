import BaseRepository from './baseRepository';
import { IChatRepository } from '../interfaces/chat/IChatRepository';
import chatModel, { IChat } from '../models/chatModel';
import { Types } from 'mongoose';

class chatRepository implements IChatRepository {

    private chatRepository: BaseRepository<IChat>;

    constructor() {
        this.chatRepository = new BaseRepository(chatModel);
    }
    async checkChat(receiverId: string, senderId: string): Promise<IChat | null> {
        try {
            let checkChat = await this.chatRepository.findOne({
                $and: [
                    { users: { $elemMatch: { $eq: senderId } } },
                    { users: { $elemMatch: { $eq: receiverId } } },
                ],
            });
            if (checkChat) {
                await checkChat.populate({ path: "users", select: "name email" });
                await checkChat.populate({
                    path: "latestMessage.sender",
                    select: "name email",
                });
            }
            return checkChat;
        } catch (error) {
            console.error("error in finding chat:", error);
            throw error;
        }
    }

    async createChat(
        receiverId: string,
        senderId: string
    ): Promise<IChat | null> {
        try {
            return await this.chatRepository.create({
                users: [senderId, receiverId],
            });
        } catch (error) {
            console.error("error in creating chat:", error);
            throw error;
        }
    }

    async getChat(userId: string): Promise<IChat[] | null> {
        try {
            const result = await this.chatRepository.findChat({
                users: { $elemMatch: { $eq: userId } },
            })
                .populate({ path: "users", select: "name email profile_picture" })
                .populate("latestMessage")
                .sort({ updatedAt: -1 });

            return result
        } catch (error) {
            console.error("error in getting chat:", error);
            throw error;
        }
    }


    async latestMessage(
        chatId: string,
        message: Types.ObjectId
    ): Promise<IChat | null> {
        try {
            return await this.chatRepository.findByIdAndUpdate(chatId, {
                latestMessage: message,
            });
        } catch (error) {
            console.error("error in updating latest message:", error);
            throw error;
        }
    }



}

export default chatRepository;
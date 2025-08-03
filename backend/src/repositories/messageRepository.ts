import BaseRepository from './baseRepository';
import { IMessageRepository } from '../interfaces/message/IMessageRepository';
import messageModel, { IMessage } from '../models/messageModel';

class messageRepository implements IMessageRepository {

    private messageRepository: BaseRepository<IMessage>;

    constructor() {
        this.messageRepository = new BaseRepository(messageModel);
    }

    async sendMessage(newMessage: object): Promise<IMessage | null> {
        try {
            let message = await this.messageRepository.create(newMessage);
            message = await message.populate("sender", "name email profile_picture");
            message = await message.populate("chat");
            return message;
        } catch (error) {
            console.error("error in sending message:", error);
            throw error;
        }
    }

    async getMessage(chatId: string): Promise<IMessage[] | null> {
        try {
            const messages = await this.messageRepository.getModel()
                .find({ chat: chatId })
                .populate("sender", "name email")
                .populate("chat")
                .exec();

            return messages;
        } catch (error) {
            console.error('error in getting message:', error);
            throw error
        }

    }
    



}

export default messageRepository;
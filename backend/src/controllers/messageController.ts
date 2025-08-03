import { Request, Response } from 'express';
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { ResponseModel } from '../utils/responseModel';
import { IMessageService } from '../interfaces/message/IMessageService';
import { io } from '../socket/socket';

const {  INTERNAL_SERVER_ERROR } = STATUS_CODES;


export class MessageController {

    constructor(private MessageServices: IMessageService) { }

    async sendMessage(req: Request, res: Response): Promise<Response | void> {
        try {
            const { chatId, senderId, content } = req.body

            if (!chatId || !senderId || !content) {
                return res.status(400).json({ error: "Invalid message data" });
            }

            const newMessage = await this.MessageServices.sendMessage(chatId, senderId, content)
            io.emit("message received", newMessage);
            res.json(newMessage)
        } catch (error) {
            console.error('error while send message', error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error("INTERNAL SERVER ERROR", error as Error))
        }
    }

    async getMessage(req: Request, res: Response): Promise<Response | void> {
        try {
            const chatId = req.query.userChatId as string

            const message = await this.MessageServices.getMessage(chatId)

            res.json(message)
        } catch (error) {
            console.error('error while fetching messages', error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error("INTERNAL SERVER ERROR", error as Error))
        }
    }




}

export default MessageController;


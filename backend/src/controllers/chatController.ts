import { Request, Response } from 'express';
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { ResponseModel } from '../utils/responseModel';
import { IChatService } from '../interfaces/chat/IChatService';
const {  OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = STATUS_CODES;
export class ChatController {

    constructor(private ChatServices: IChatService) { }
    async accessChat(req: Request, res: Response): Promise<Response | void> {
        try {
            const { receiverId, senderId } = req.body
            const chat = await this.ChatServices.accessChat(receiverId, senderId)
            // res.json(chat)
            return res.status(OK).json(ResponseModel.success("Access chat ", chat))
        } catch (error) {
            console.error('error in creating chat room', error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error("INTERNAL SERVER ERROR", error as Error))
        }
    }

    async getChat(req: Request, res: Response): Promise<Response | void> {
        try {
            const userId = req.query.userId as string
            console.log('userid kiti', userId);

            const messages = await this.ChatServices.getChat(userId)
            console.log(111, messages);

            res.json(messages)
        } catch (error) {
            console.error('erron while fetching message details', error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error("INTERNAL SERVER ERROR", error as Error))
        }
    }

}

export default ChatController;


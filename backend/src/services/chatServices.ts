import { IChatService } from "../interfaces/chat/IChatService";
import { IChatRepository } from "../interfaces/chat/IChatRepository";
import { IChat } from "../models/chatModel";


class chatServices implements IChatService {
    constructor(private chatRepository: IChatRepository) { }

    async accessChat(receiverId:string,senderId:string):Promise<IChat | undefined| null> {
        try {
            let chat = await this.chatRepository.checkChat(receiverId,senderId)
            console.log('chat illa',chat);
            
 
            if(!chat){
                console.log('chat illengil');
                
                 const createChat = await this.chatRepository.createChat(receiverId,senderId)
                 chat = await this.chatRepository.checkChat(receiverId,senderId)
            }

            console.log('ipo chat vanno ',chat);
            
            return chat 
           
        } catch (error) {
            console.error('error in sending message',error); 
        }
    }

    async getChat(userId:string):Promise<IChat[] | undefined | null>{
        try {            
            let chats = await this.chatRepository.getChat(userId)            
            if(!chats){
                return null
            }
            chats = chats?.map(chat => {
                const chatObject = chat.toObject();
                chatObject.users = chatObject.users.filter((user: any) => user._id.toString() !== userId); 
                return chatObject;
            })
            
            return chats
        } catch (error) {
            console.error('error while fetching messages',error);
        }
    }

  

   
}

export default chatServices;
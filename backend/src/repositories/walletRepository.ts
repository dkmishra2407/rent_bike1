import BaseRepository from './baseRepository';
import { IWalletRepository} from '../interfaces/wallet/IWalletRepository';
import walletModel, { IWallet } from '../models/walletModel';

class walletRepository implements IWalletRepository {
  
    private walletRepository: BaseRepository<IWallet>;

    constructor() {
        this.walletRepository = new BaseRepository(walletModel);
    }
    
    async getWallet(walletId:string):Promise<IWallet>{
        try {
            const result = await this.walletRepository.findById(walletId)
            if (!result) {
                throw new Error("Wallet not found");
            }

            result.history = result.history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            return result 
        } catch (error) {
            console.log("error in repository layer of get wallet",error)
            throw error
        }
    }

    async updateWalletBalance(walletId: string, newBalance: number, historyEntry: object): Promise<IWallet | null> {
        try {
            const updatedWallet = await this.walletRepository.updateById(walletId, {
                $set: { balance: newBalance }, 
                $push: { history: historyEntry }, 
            } as any); 
    
            if (!updatedWallet) {
                throw new Error("Wallet not found or update failed");
            }
    
            return updatedWallet;
        } catch (error) {
            console.error("Error in walletRepository - updateWalletBalance:", error);
            throw error;
        }
    }


}

export default walletRepository;
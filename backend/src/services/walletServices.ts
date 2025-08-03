import { IWalletService } from "../interfaces/wallet/IWalletService";
import { IWalletRepository } from "../interfaces/wallet/IWalletRepository";
import { IWallet } from "../models/walletModel";


class walletServices implements IWalletService {
    constructor(private walletRepository: IWalletRepository) { }

    async getWallet(walletId: string): Promise<IWallet> {
        try {
            const result = await this.walletRepository.getWallet(walletId)
            return result
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async saveWallet(walletId: string, newBalance:number,total:number, bikeId: string) {
        try {
            const historyEntry = {
                date: new Date(),
                type: "debit",
                amount: total,
                reason: bikeId
            };

            return await this.walletRepository.updateWalletBalance(walletId, newBalance, historyEntry);
        } catch (error) {
            console.error("Error in WalletServices - saveWallet:", error);
            throw error;
        }
    }
}

export default walletServices;
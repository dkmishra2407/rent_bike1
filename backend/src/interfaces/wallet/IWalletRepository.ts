import { IWallet } from "../../models/walletModel";

export interface IWalletRepository {
    getWallet(walletId: string): Promise<IWallet>;
    updateWalletBalance(walletId: string, newBalance: number, historyEntry: object): Promise<IWallet | null>

}

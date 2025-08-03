import { IWallet } from "../../models/walletModel";

export interface IWalletService {
    getWallet(walletId: string): Promise<IWallet>;
    saveWallet(walletId: string, newBalance: number, total: number, bikeId: string): Promise<any>

}

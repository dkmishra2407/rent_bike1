import { Request, Response } from 'express';
import { STATUS_CODES } from "../constants/httpStatusCodes";

import { ResponseModel } from '../utils/responseModel';
import { IWalletService } from '../interfaces/wallet/IWalletService';

const { OK, NOT_FOUND } = STATUS_CODES;

export class WalletController {
    constructor(private WalletServices: IWalletService) { }
    async getWallet(req: Request, res: Response): Promise<Response | void> {
        try {
            const { walletId } = req.params;

            if (!walletId) {
                return res.status(NOT_FOUND).json(ResponseModel.error("wallet id missing"))
            }
            const wallet = await this.WalletServices.getWallet(walletId)
            if (!wallet) {
                return res.status(NOT_FOUND).json(ResponseModel.error("Wallet not found"))
            }

            return res.status(OK).json(ResponseModel.success('Get wallet',wallet))
        } catch (error) {
            console.error("Error fetching wallet:", error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
}

export default WalletController;


import { IOrder } from "../../models/orderModel";
import { IWallet } from "../../models/walletModel";
import { BikeData } from "../BikeInterface";
import { UserInterface } from "../IUser";

export interface IOrderService {
  saveOrder(newOrder: IOrder): Promise<IOrder>;
  findBike(bikeId: string): Promise<BikeData | null>
  findOrder(orderId: string): Promise<IOrder | null>
  addBalance(walletId: string, refundAmount: Number): Promise<IWallet | null>;
  completeOrder(orderId: string): Promise<IOrder | null>
  findUser(userId: string): Promise<UserInterface>

}

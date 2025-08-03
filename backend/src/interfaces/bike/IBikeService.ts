import { Request, Response } from "express";
import { UserInterface } from "../IUser";
import { BikeData } from "../BikeInterface";
import { IOrder } from "../../models/orderModel";

interface IHostService {
  saveBikeDetails(req: Request, res: Response): Promise<Response | undefined>;
  isAdminVerifyUser(userId: string): Promise<UserInterface | null>;
  fetchBikeData(userId: string | undefined): Promise<BikeData[]>;
  bikeSingleView(bikeId: string): Promise<BikeData | null>;
  deleteBike(bikeId: string): Promise<boolean>;
  editBike(req: Request, res: Response): Promise<Response>;
  findOrder(userId: string): Promise<IOrder[] | undefined>
  orderDetails(orderId: string): Promise<any>
}

export default IHostService;

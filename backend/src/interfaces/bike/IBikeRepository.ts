import { IOrder } from "../../models/orderModel";
import { BikeData, BikeDataInput } from "../BikeInterface";
import { UserInterface } from "../IUser";

interface IHostRepository {
  saveBikeDetails(documentData: BikeDataInput): Promise<BikeData>;
  isAdminVerifyUser(userId: string): Promise<UserInterface | null>;
  fetchBikeData(userId: string): Promise<BikeData[]>;
  bikeSingleView(bikeId: string): Promise<BikeData | null>;
  deleteBike(bikeId: string): Promise<boolean>;
  editBike(insuranceExpDate: Date, polutionExpDate: Date, insuranceImageUrl: string, PolutionImageUrl: string, bikeId: string): Promise<BikeData>;
  getOrder(userId: string): Promise<IOrder[] | undefined>;
  findOrder(orderId: string): Promise<IOrder>
  findUser(userId: string): Promise<UserInterface>
}

export default IHostRepository;

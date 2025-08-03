import { UserInterface } from "../IUser";
import { BikeData } from "../BikeInterface";
import { IOrder } from "../../models/orderModel";
import { IFeedback } from "../../models/feedback";

export interface IBikeWithUserDetails extends BikeData {
  userDetails: UserInterface;
}

export interface IAdminService {
  getAllUsers(filters: { page: number; limit: number; search: string; isBlocked?: string | undefined; isUser?: string | undefined; }): Promise<{
    users: UserInterface[];
    totalUsers: number;
    totalPages: number;
  } | undefined>;

  getSingleUser(userId: string): Promise<UserInterface | null | undefined>;
  userVerify(userId: string): Promise<UserInterface | string | undefined>;
  userBlockUnblock(userId: string): Promise<UserInterface | { success: boolean; message: string } | undefined>;

  getAllBikeDetails(
    query: object,
    options: { skip: number; limit: number; sort: object; search?: string }
  ): Promise<{
    bikes: IBikeWithUserDetails[];
    total: number;
  }>;

  verifyHost(bikeId: string): Promise<BikeData | string | undefined>;
  revokeHost(bikeId: string, reason: string): Promise<BikeData | string | undefined>;
  isEditOn(bikeId: string): Promise<BikeData | undefined>;
  getOrder(): Promise<IOrder[] | undefined>;
  orderDetails(orderId: string): Promise<any>
  allFeedbacks(): Promise<IFeedback[] | null>
  deleteFeedback(feedbackId: string): Promise<IFeedback | null>

}

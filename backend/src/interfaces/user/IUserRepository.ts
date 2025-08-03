import { IOrder } from "../../models/orderModel";
import { IReview } from "../../models/reviewModel";
import { IWallet } from "../../models/walletModel";
import { BikeData } from "../BikeInterface";
import { UserInterface } from "../IUser";

export interface IUserRepository {
  emailExistCheck(email: string): Promise<boolean | null>;
  saveUser(userData: any): Promise<UserInterface | null>;
  createWallet(): Promise<IWallet>;
  login(email: string): Promise<UserInterface | null>;
  getProfile(email: string): Promise<UserInterface | null>;
  editProfile(email: string, userData: Partial<UserInterface>): Promise<UserInterface | null>;
  saveUserDocuments(userId: string, documentData: Partial<UserInterface>): Promise<UserInterface | null>;
  getUserById(userId: string): Promise<UserInterface | null>;
  getBikeList(query: object, skip: number, limit: number): Promise<BikeData[]>;
  countBikes(query: object): Promise<number>;
  getBikeDetails(id: string): Promise<any | null>;
  findUserByEmail(email: string): Promise<UserInterface | null | undefined>;
  getOrder(userId: string): Promise<IOrder[]>;
  findOrder(orderId: string): Promise<IOrder | undefined>;
  findBike(bikeId: string): Promise<BikeData>;
  findUser(userId: string): Promise<UserInterface>;
  findOrderAndUpdate(orderId: string): Promise<IOrder | null>
  returnOrder(orderId: string): Promise<IOrder | null>
  submitReview(reviewerId: string, bikeId: string, rating: number, feedback: string): Promise<IReview | null>
  findReviews(bikeId: string): Promise<IReview[] | null>
  userAlreadyReviewed(userid: string): Promise<IReview | null>
  allOrders(): Promise<IOrder[] | null>
}

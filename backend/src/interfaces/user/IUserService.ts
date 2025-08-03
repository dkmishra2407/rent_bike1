import { IOrder } from "../../models/orderModel";
import { IReview } from "../../models/reviewModel";
import { IWallet } from "../../models/walletModel";
import { UserInterface } from "../IUser";
import { Request, Response } from "express";

export interface IUserService {
    userSignup(userData: UserInterface): Promise<boolean | null>;
    saveUser(userData: any): Promise<UserInterface | null>;
    createWallet(): Promise<IWallet>;
    login(email: string): Promise<UserInterface | null>;
    getProfile(email: string): Promise<UserInterface | null>;
    editProfile(email: string, userData: Partial<UserInterface>, req: Request): Promise<UserInterface | null>;
    editUserDocuments(
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>> | UserInterface | null>;
    GetBikeList(filters: {
        page: number;
        limit: number;
        search: string;
        fuelType: string;
        minRent: number;
        maxRent: number;
    }): Promise<{
        bikeList: any[];
        totalBikes: number;
        totalPages: number;
    }>;
    getBikeDetails(id: string): Promise<any | null>;
    findUserByEmail(email: string): Promise<UserInterface | null | undefined>;
    getOrder(userId: string): Promise<IOrder[]>;
    orderDetails(orderId: string): Promise<any>
    findOrderAndUpdate(orderId: string): Promise<IOrder | null>
    returnOrder(orderId: string): Promise<IOrder | null>
    submitReview(reviewerId: string, bikeId: string, rating: number, feedback: string): Promise<IReview | null>
    findReviews(bikeId: string): Promise<IReview[] | null>
    userAlreadyReviewed(userid: string): Promise<IReview | null>
    allOrders(): Promise<IOrder[] | null>
}


import { IAdminRepository } from "../interfaces/admin/IAdminRepository";
import { IAdminService } from "../interfaces/admin/IAdminService";
import { UserInterface } from "../interfaces/IUser";
import { IBikeWithUserDetails } from "../interfaces/admin/IAdminRepository";
import { BikeData } from "../interfaces/BikeInterface";
import { IOrder } from "../models/orderModel";
import { IFeedback } from "../models/feedback";

class AdminServices implements IAdminService {
    constructor(private adminRepository: IAdminRepository) { }

    async getAllUsers(filters: {
        page: number;
        limit: number;
        search: string;
        isBlocked?: string | undefined;
        isUser?: string | undefined
    }): Promise<{ users: UserInterface[]; totalUsers: number; totalPages: number } | undefined> {
        try {
            return await this.adminRepository.getAllUsers(filters)
        } catch (error) {
            console.log(error);
            throw error;

        }
    }

    async getSingleUser(userId: string): Promise<UserInterface | null | undefined> {
        try {
            return await this.adminRepository.getSingleUser(userId)

        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async userVerify(userId: string): Promise<UserInterface | string | undefined> {
        try {
            return await this.adminRepository.userVerify(userId)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async userBlockUnblock(userId: string): Promise<UserInterface | { success: boolean; message: string } | undefined> {
        try {
            return await this.adminRepository.userBlockUnblock(userId)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async getAllBikeDetails(
        query: object,
        options: { skip: number; limit: number; sort: object, search: string }
    ): Promise<{ bikes: IBikeWithUserDetails[]; total: number }> {
        try {
            return await this.adminRepository.getAllBikeDetails(query, options)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async verifyHost(bikeId: string): Promise<BikeData | string | undefined> {
        try {
            return await this.adminRepository.verifyHost(bikeId)

        } catch (error) {
            console.log(error);
            throw error

        }
    }

    async revokeHost(bikeId: string, reason: string): Promise<BikeData | string | undefined> {
        try {
            return await this.adminRepository.revokeHost(bikeId, reason)

        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async findUserByEmail(email: string): Promise<UserInterface | null | undefined> {
        try {
            return await this.adminRepository.findUserByEmail(email)

        } catch (error) {
            console.log(error);
            throw error

        }
    }

    async isEditOn(bikeId: string): Promise<BikeData | undefined> {
        try {
            return await this.adminRepository.isEditOn(bikeId)
        } catch (error) {
            console.log("error is is edit on : ", error)
            throw error
        }
    }

    async getOrder(): Promise<IOrder[] | undefined> {
        try {
            const result = await this.adminRepository.getOrder()
            return result
        } catch (error) {
            console.log("error in admin services get order list :  ", error)
            throw error
        }
    }

    async orderDetails(orderId:string):Promise<any>{
        try {
            const order = await this.adminRepository.findOrder(orderId)

            if (!order) {
                throw new Error("Order not found");
            }

            const bike = await this.adminRepository.findBike(order?.bikeId.toString())

            if (!bike) {
                throw new Error("Bike details not found");
            }

            const owner = await this.adminRepository.findUser(bike.userId.toString())
            if (!owner) {
                throw new Error("Bike owner details not found");
            }

            const user = await this.adminRepository.findUser(order.userId.toString())
            if (!user) {
                throw new Error("User details not found");
            }

            return {
                order,
                bike,
                owner,
                user
            };
        } catch (error) {
            console.error("Error in AdminServices.orderDetails:", error);
            throw error
        }
    }


    async allFeedbacks(): Promise<IFeedback[] | null> {
        try {
            return await this.adminRepository.allFeedbacks()
        } catch (error) {
            throw error
        }
    }

    async deleteFeedback(feedbackId: string): Promise<IFeedback | null> {
        try {
            return await this.adminRepository.deleteFeedback(feedbackId)
        } catch (error) {
            throw error
        }
    }


}

export default AdminServices;
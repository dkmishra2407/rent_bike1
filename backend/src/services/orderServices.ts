import { IOrderService } from "../interfaces/order/IOrderService";
import { IOrderRepository } from "../interfaces/order/IOrderRepository";
import { IOrder } from "../models/orderModel";
import { BikeData } from "../interfaces/BikeInterface";
import { throwDeprecation } from "process";
import { IWallet } from "../models/walletModel";
import { UserInterface } from "../interfaces/IUser";

class orderServices implements IOrderService {
    constructor(private orderRepository: IOrderRepository) { }

    async saveOrder(newOrder: IOrder): Promise<IOrder> {
        try {
            const result = this.orderRepository.saveOrder(newOrder)
            return result
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    findBike(bikeId: string): Promise<BikeData | null> {
        try {
            const result = this.orderRepository.findBike(bikeId)
            return result
            
        } catch (error) {
            console.log("Error in order service findownerof bike",error)
            throw error
        }
    }

    findOrder(orderId: string): Promise<IOrder | null> {
        try {
            const result = this.orderRepository.findOrder(orderId)
            return result
        } catch (error) {
            throw error
        }
    }

    async addBalance(walletId: string, refundAmount: Number): Promise<IWallet | null> {
        try {
            return await this.orderRepository.addBalance(walletId,refundAmount)
        } catch (error) {
            throw error
        }
    }

    async completeOrder(orderId: string): Promise<IOrder | null> {
        try {
            return await this.orderRepository.completeOrder(orderId)
        } catch (error) {
            throw error
        }
    }

    async findUser(userId: string): Promise<UserInterface> {
        try {
            return await this.orderRepository.findUser(userId)
        } catch (error) {
            throw error
        }
    }
}

export default orderServices;
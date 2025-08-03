import BaseRepository from './baseRepository';
import { IOrderRepository } from '../interfaces/order/IOrderRepository';
import OrderModel, { IOrder } from '../models/orderModel';
import { BikeData } from '../interfaces/BikeInterface';
import bikeModel from '../models/bikeModel';
import { error } from 'console';
import walletModel, { IWallet } from '../models/walletModel';
import mongoose from 'mongoose';
import { UserInterface } from '../interfaces/IUser';
import userModel from '../models/userModels';

class orderRepository implements IOrderRepository {

    private orderRepository: BaseRepository<IOrder>;
    private bikeRepository: BaseRepository<BikeData>;
    private walletRepository: BaseRepository<IWallet>
    private userRepository: BaseRepository<UserInterface>

    constructor() {
        this.orderRepository = new BaseRepository(OrderModel);
        this.bikeRepository = new BaseRepository(bikeModel)
        this.walletRepository = new BaseRepository(walletModel)
        this.userRepository = new BaseRepository(userModel)
    }

    async saveOrder(newOrder: IOrder): Promise<IOrder> {
        try {
            const Order = await this.orderRepository.create(newOrder)
            return Order;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
    async findBike(bikeId: string): Promise<BikeData | null> {
        try {
            const bike = await this.bikeRepository.findById(bikeId)

            if (!bike) {
                return null
            }
            return bike

        } catch (error) {
            console.log("error in order repository find bike owner", error)
            throw error
        }
    }

    async findOrder(orderId: string): Promise<IOrder | null> {
        try {
            const order = await this.orderRepository.findOne({ _id: orderId })
            return order
        } catch (error) {
            throw error
        }
    }

    async findUser(userId: string): Promise<UserInterface> {
        try {
            const user = await this.userRepository.findById(userId)
            if (!user) throw error

            return user

        } catch (error) {
            throw error
        }
    }

    async addBalance(walletId: string, refundAmount: Number): Promise<IWallet | null> {
        try {
            const updateData = {
                $inc: { balance: refundAmount },
                $push: {
                    history: {
                        date: new Date(),
                        type: "credit",
                        amount: refundAmount,
                        reason: "Early Return"
                    }
                }
            };

            const a = await this.walletRepository.updateOne({ _id: walletId }, updateData);
            const wallet = this.walletRepository.findOne({ _id: walletId });
            if (!wallet) {
                throw new Error("wallet not found")
            }
            return wallet

        } catch (error) {
            throw error
        }
    }

    async completeOrder(orderId: string): Promise<IOrder | null> {
        try {
            const result = await this.orderRepository.findOneAndUpdate(
                { _id: orderId },
                { status: "Completed" },
                { new: true }
            );

            if (!result) {
                throw new Error("Error while return early")
            }

            return result
        } catch (error) {
            throw error
        }
    }



}

export default orderRepository;
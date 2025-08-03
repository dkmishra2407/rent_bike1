import { BikeData } from '../interfaces/BikeInterface';
import bikeModel from '../models/bikeModel';
import userModel from '../models/userModels';
import IHostRepository from '../interfaces/bike/IBikeRepository';
import BaseRepository from './baseRepository';
import { UserInterface } from '../interfaces/IUser';
import OrderModel, { IOrder } from '../models/orderModel';
import { error } from 'console';

class HostRepository implements IHostRepository {
  private userRepository: BaseRepository<UserInterface>;
  private bikeRepository: BaseRepository<BikeData>;
  private orderRepository: BaseRepository<IOrder>

  constructor() {
    this.userRepository = new BaseRepository(userModel);
    this.bikeRepository = new BaseRepository(bikeModel);
    this.orderRepository = new BaseRepository(OrderModel)
  }

  async saveBikeDetails(documentData: BikeData): Promise<BikeData> {
    try {
      return await this.bikeRepository.create(documentData);
    } catch (error) {
      console.error("Error updating user documents in the repository:", error);
      throw new Error("Failed to update user documents in the database");
    }
  }

  async isAdminVerifyUser(userId: string): Promise<UserInterface | null> {
    try {
      const user = await this.userRepository.findById(userId)
      return user
    } catch (error) {
      console.log(error);
      throw new Error('Failed to verify user');

    }
  }

  async fetchBikeData(userId: string | undefined): Promise<BikeData[]> {
    try {
      if (!userId) throw new Error("User ID is undefined");
      const bikes = await this.bikeRepository.find({ userId });
      return bikes
    } catch (error) {
      console.error("Error in repository layer:", error);
      throw error;
    }
  }

  async bikeSingleView(bikeId: string): Promise<BikeData | null> {
    try {
      if (!bikeId) throw new Error("User ID is undefined");
      const bike = await this.bikeRepository.findById(bikeId);
      return bike
    } catch (error) {
      console.error('Error fetching single bike view in the repository:', error);
      throw error;
    }
  }

  async deleteBike(bikeId: string): Promise<boolean> {
    try {
      if (!bikeId) throw new Error('Bike ID is undefined');
      const result = await this.bikeRepository.deleteOne({ _id: bikeId });
      if (result.deletedCount === 0) {
        throw new Error('Bike not found');
      }
      return true;
    } catch (error) {
      console.error('Error deleting bike in the repository:', error);
      throw error;
    }
  }


  async editBike(
    insuranceExpDate: Date,
    polutionExpDate: Date,
    insuranceImageUrl: string,
    PolutionImageUrl: string,
    bikeId: string
  ): Promise<BikeData> {
    try {
      const updateData: Partial<BikeData> = {
        insuranceExpDate,
        polutionExpDate,
        insuranceImage: insuranceImageUrl || undefined,
        PolutionImage: PolutionImageUrl || undefined,
        isEdit: false,
        isHost: false
      };
      const updatedBike = await this.bikeRepository.updateById(bikeId, updateData);
      if (!updatedBike) {
        throw new Error("Bike not found.");
      }
      return updatedBike;

    } catch (error) {
      console.error("Error in repository layer edit bike:", error);
      throw error;
    }
  }

  async getOrder(userId: string): Promise<IOrder[]> {
    try {
      const orders = await this.orderRepository.find({ ownerId: userId })
      console.log(3333333333333333333333333333333333333333333333, orders)
      if (!orders || orders.length === 0) {
        return [];
      }
      return orders
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async findOrder(orderId: string): Promise<IOrder> {
    try {
      const order = await this.orderRepository.findById(orderId)
      if (!order) {
        throw error
      }
      return order
    } catch (error) {
      throw error
    }
  }

  async findUser(userId:string):Promise<UserInterface>{
    try {
      const user = await this.userRepository.findById(userId)
      if(!user) throw error

      return user
      
    } catch (error) {
      throw error
    }
  }




}

export default HostRepository;
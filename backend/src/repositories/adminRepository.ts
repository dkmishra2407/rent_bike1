import bikeModel from '../models/bikeModel';
import userModel from '../models/userModels';
import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
import { IAdminRepository, IBikeWithUserDetails } from '../interfaces/admin/IAdminRepository';
import BaseRepository from './baseRepository';
import { UserInterface } from '../interfaces/IUser';
import { BikeData } from '../interfaces/BikeInterface';
import { SortOrder } from 'mongoose';
import OrderModel, { IOrder } from '../models/orderModel';
import { error } from 'console';
import FeedbackModel, { IFeedback } from '../models/feedback';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TRANSPORTER_EMAIL,
        pass: process.env.TRANSPORTER_PASS,
    }
})

class AdminRepository implements IAdminRepository {

    private userRepository: BaseRepository<UserInterface>;
    private bikeRepository: BaseRepository<BikeData>;
    private orderRepository: BaseRepository<IOrder>
    private feedbackRepository: BaseRepository<IFeedback>

    constructor() {
        this.userRepository = new BaseRepository(userModel);
        this.bikeRepository = new BaseRepository(bikeModel);
        this.orderRepository = new BaseRepository(OrderModel)
        this.feedbackRepository = new BaseRepository(FeedbackModel)
    }

    async getAllUsers(filters: {
        page: number;
        limit: number;
        search: string;
        isBlocked?: string | undefined;
        isUser?: string | undefined
    }): Promise<{ users: UserInterface[]; totalUsers: number; totalPages: number } | undefined> {
        try {
            const { page, limit, search, isBlocked, isUser } = filters;
            const query: any = {};

            if (isBlocked !== undefined) query.isBlocked = isBlocked;
            if (isUser !== undefined) query.isUser = isUser;
            if (search) query.name = { $regex: search, $options: 'i' };

            const skip = (page - 1) * limit;

            const sort: { [key: string]: SortOrder } = { name: 1 };

            const users = await this.userRepository.find(query, { sort, skip, limit });

            const totalUsers = await this.userRepository.count(query);

            const totalPages = Math.ceil(totalUsers / limit)

            return { users, totalUsers, totalPages }
        } catch (error) {
            console.log(error);
        }
    }

    async getSingleUser(userId: string): Promise<UserInterface | null | undefined> {
        try {
            return await this.userRepository.findById(userId)
        } catch (error) {
            console.log(error);
        }
    }

    async userVerify(userId: string): Promise<UserInterface | string | undefined> {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) return 'User not found'
            user.isUser = !user.isUser;
            await user.save();
            return user
        } catch (error) {
            console.log(error);
        }
    }

    async userBlockUnblock(userId: string): Promise<UserInterface | { success: boolean; message: string } | undefined> {
        try {
            const findUser = await this.userRepository.findById(userId)

            if (!findUser) {
                return { success: false, message: "User not found" };
            }

            findUser.isBlocked = !findUser.isBlocked;

            if (findUser.isBlocked) {
                const mailOptions = {
                    from: process.env.TRANSPORTER_EMAIL,
                    to: findUser?.email,
                    subject: 'Account Blocked by Admin',
                    text: `Your account has been blocked by the admin due to certain activities. Please contact support if you believe this is a mistake.`,
                }

                try {
                    await transporter.sendMail(mailOptions);
                } catch (emailError) {
                    console.error('Error sending email:', emailError);
                    return { success: false, message: 'Failed to send email notification' };
                }
            }

            await findUser.save();
            return findUser
        } catch (error) {
            console.log(error);

        }
    }

    async getAllBikeDetails(
        query: object,
        options: { skip: number; limit: number; sort: object, search?: string }
    ): Promise<{ bikes: IBikeWithUserDetails[]; total: number }> {
        try {
            const { skip, limit, sort, search } = options;

            const pipeline: any[] = [

                { $match: query },

                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails",
                    },
                },

                { $unwind: "$userDetails" },
            ];

            if (search) {
                pipeline.push({
                    $match: {
                        "userDetails.name": { $regex: search, $options: "i" }, // Case-insensitive search
                    },
                });
            }

            if (Object.keys(sort).length > 0) {
                pipeline.push({ $sort: sort });
            } else {
                pipeline.push({ $sort: { _id: 1 } });
            }

            pipeline.push(
                { $skip: skip },
                { $limit: limit },
                {
                    $project: {
                        _id: 1,
                        companyName: 1,
                        modelName: 1,
                        rentAmount: 1,
                        fuelType: 1,
                        images: 1,
                        isBlocked: 1,
                        isHost: 1,
                        registerNumber: 1,
                        insuranceExpDate: 1,
                        polutionExpDate: 1,
                        rcImage: 1,
                        insuranceImage: 1,
                        PolutionImage: 1,
                        "userDetails._id": 1,
                        "userDetails.name": 1,
                        "userDetails.email": 1,
                        "userDetails.phoneNumber": 1,
                        "userDetails.address": 1,
                        "userDetails.profile_picture": 1,
                    },
                }
            );

            // const result = await bikeModel.aggregate(pipeline);
            const bikesWithUserDetails = await this.bikeRepository.aggregate(pipeline);

            // const total = await bikeModel.countDocuments(query);
            const total = await this.bikeRepository.count(query)

            const result = bikesWithUserDetails.map((bike: any) => {
                return {
                    ...bike,
                    userDetails: bike.userDetails,
                };
            });
            console.log(222222222, result);


            return { bikes: result, total };
        } catch (error) {
            console.error("Error fetching bike details with user details:", error);
            throw error;
        }
    }

    async verifyHost(bikeId: string): Promise<BikeData | string | undefined> {
        try {
            const bike = await this.bikeRepository.findById(bikeId);

            if (!bike) return 'User not found'

            bike.isHost = true
            const user = await this.userRepository.findById(bike.userId.toString())

            if (bike.isHost) {
                const mailOptions = {
                    from: process.env.TRANSPORTER_EMAIL,
                    to: user?.email,
                    subject: 'Approved Mail',
                    text: `Welcome to 2wheleeee. Your Host Service is approved`
                }

                await transporter.sendMail(mailOptions)
            }

            await bike.save();
            return bike

        } catch (error) {
            console.log(error);

        }
    }

    async revokeHost(bikeId: string, reason: string): Promise<BikeData | string | undefined> {
        try {
            const bike = await this.bikeRepository.findById(bikeId);

            if (!bike) return 'User not found'

            bike.isHost = false
            const user = await this.userRepository.findById(bike.userId.toString())

            if (!bike.isHost) {
                const mailOptions = {
                    from: process.env.TRANSPORTER_EMAIL,
                    to: user?.email,
                    subject: 'Revoke Mail',
                    text: `Welcome to 2wheleeee. Your Host Service is Rejected \n Reason : ${reason}`
                }
                await transporter.sendMail(mailOptions)
                console.log("mailllllllllllllllll aayxhuuuuuuuuuuuuuuuuuutooooooooooooooooooooooooooo")
            }

            await bike.save();
            return bike

        } catch (error) {
            console.log(error)
        }
    }

    async findUserByEmail(email: string): Promise<UserInterface | null | undefined> {
        try {
            const user = await this.userRepository.findOne({ email });
            return user

        } catch (error) {
            console.log(error);
        }
    }

    async isEditOn(bikeId: string): Promise<BikeData | undefined> {
        try {
            const bike = await this.bikeRepository.findById(bikeId)

            if (!bike) {
                throw new Error("Bike not found");
            }

            bike.isEdit = true;
            bike.isHost = false
            await bike.save()
            return bike


        } catch (error) {
            console.log("error is repository is edit on : ", error);
            throw error
        }
    }

    async getOrder(): Promise<IOrder[] | undefined> {
        try {
            const order = await this.orderRepository.findModel()
            return order
        } catch (error) {
            console.log("error in admin repository is get order : ", error);
            throw error
        }
    }

    async findOrder(orderId: string): Promise<IOrder | undefined> {
        try {
            const orderdetails = await this.orderRepository.findById(orderId)
            if (!orderdetails) {
                throw error
            }
            return orderdetails

        } catch (error) {
            console.log("error in admin repository is find order : ", error);
            throw error
        }
    }

    async findBike(bikeId: string): Promise<BikeData> {
        try {
            const bikeDetails = await this.bikeRepository.findById(bikeId)
            if (!bikeDetails) {
                throw error
            }
            return bikeDetails

        } catch (error) {
            console.log("error in admin repository is find bike : ", error);
            throw error
        }
    }

    async findUser(userId: string): Promise<UserInterface> {
        try {
            const userDetails = await this.userRepository.findById(userId)
            if (!userDetails) {
                throw error
            }
            return userDetails
        } catch (error) {
            console.log("error in admin repository is find user : ", error);
            throw error
        }
    }

    async allFeedbacks(): Promise<IFeedback[] | null> {
        try {
            return await this.feedbackRepository.findFeedback()
        } catch (error) {
            throw error
        }
    }

    async deleteFeedback(id: string): Promise<IFeedback | null> {
        try {
            return await this.feedbackRepository.findByIdAndDelete(id)
        } catch (error) {
            throw error
        }
    }


}

export default AdminRepository;
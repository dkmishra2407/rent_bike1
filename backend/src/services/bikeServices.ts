import { BikeData, BikeDataInput } from "../interfaces/BikeInterface";
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { Request, Response } from "express";
import cloudinary from "../config/cloudinaryConfig";
import { UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import mongoose from "mongoose";
import IHostRepository from "../interfaces/bike/IBikeRepository";
import IHostService from "../interfaces/bike/IBikeService";
import { UserInterface } from "../interfaces/IUser";
import { ResponseModel } from "../utils/responseModel";
import { IOrder } from "../models/orderModel";
import { IUserRepository } from "../interfaces/user/IUserRepository";
const { OK, INTERNAL_SERVER_ERROR, BAD_REQUEST } = STATUS_CODES;


class HostServices implements IHostService {
    constructor(private hostRepository: IHostRepository, private userRepository: IUserRepository) { }

    async saveBikeDetails(req: Request, res: Response): Promise<Response | undefined> {
        try {

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };


            const images: Express.Multer.File[] = files?.images || [];
            const rcImage: Express.Multer.File | undefined = files?.rcImage?.[0];
            const PolutionImage: Express.Multer.File | undefined = files?.PolutionImage?.[0];
            const insuranceImage: Express.Multer.File | undefined = files?.insuranceImage?.[0];

            const uploadToCloudinary = (buffer: Buffer, folder: string): Promise<UploadApiResponse> => {
                return new Promise((resolve, reject) => {
                    const readableStream = new Readable();
                    readableStream.push(buffer);
                    readableStream.push(null);
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder, resource_type: "image" },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result as UploadApiResponse);
                        }
                    );
                    readableStream.pipe(uploadStream);
                });
            };


            const imageUploadPromises = images.map((image) =>
                uploadToCloudinary(image.buffer, "bikes/images")
            );


            const rcImageUploadPromise = rcImage
                ? uploadToCloudinary(rcImage.buffer, "bikes/rc_images")
                : null;

            const PolutionImageUploadPromise = PolutionImage
                ? uploadToCloudinary(PolutionImage.buffer, "bikes/Polution_images")
                : null;

            const insuranceImageUploadPromise = insuranceImage
                ? uploadToCloudinary(insuranceImage.buffer, "bikes/insurance_images")
                : null;




            const uploadedImages = await Promise.all(imageUploadPromises);

            const uploadedRcImage = rcImageUploadPromise
                ? await rcImageUploadPromise
                : null;
            const uploadedPolutionImage = PolutionImageUploadPromise
                ? await PolutionImageUploadPromise
                : null;

            const uploadedInsuranceImage = insuranceImageUploadPromise
                ? await insuranceImageUploadPromise
                : null;

            if (!req.userId) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("User ID is required"));
            }

            const location = req.body.location
            console.log(333,location);
            


            const bikeData: BikeDataInput = {
                userId: new mongoose.Types.ObjectId(req.userId),
                companyName: req.body.companyName,
                modelName: req.body.modelName,
                rentAmount: req.body.rentAmount,
                fuelType: req.body.fuelType,
                registerNumber: req.body.registerNumber,
                insuranceExpDate: req.body.insuranceExpDate,
                polutionExpDate: req.body.polutionExpDate,
                images: uploadedImages.map((image) => image.secure_url),
                rcImage: uploadedRcImage?.secure_url || null,
                PolutionImage: uploadedPolutionImage?.secure_url || null,
                insuranceImage: uploadedInsuranceImage?.secure_url || null,
                isEdit: false,
                offer: null,
                offerApplied: false,
                offerPrice: null,
                location: location
            };

            console.log(321, bikeData);

            const savedBike = await this.hostRepository.saveBikeDetails(bikeData);
            return res.status(OK).json(ResponseModel.success("Bike details saved successfully", {data: savedBike}));

        } catch (error) {
            console.error("Error uploading images or saving bike details:", error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))
        }
    }

    async isAdminVerifyUser(userId: string): Promise<UserInterface | null> {
        try {
            const findUser = await this.hostRepository.isAdminVerifyUser(userId);
            return findUser
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async fetchBikeData(userId: string | undefined): Promise<BikeData[]> {
        try {
            if (!userId) throw new Error("User ID is undefined");

            const bikes = await this.hostRepository.fetchBikeData(userId)
            return bikes
        } catch (error) {
            console.error("Error in service layer:", error);
            throw error;
        }
    }

    async bikeSingleView(bikeId: string): Promise<BikeData | null> {
        try {
            const bike = await this.hostRepository.bikeSingleView(bikeId)
            return bike
        } catch (error) {
            console.error("Error in service layer:", error);
            throw error;
        }
    }

    async deleteBike(bikeId: string): Promise<boolean> {
        try {
            const result = await this.hostRepository.deleteBike(bikeId)
            return result
        } catch (error) {
            console.error("Error in service layer:", error);
            throw error;
        }
    }

    async editBike(req: Request, res: Response): Promise<Response> {
        try {
            const { bikeId } = req.query;

            if (!bikeId || typeof bikeId !== "string") {
                return res.status(BAD_REQUEST).json({ success: false, message: "Bike ID is required and must be a string." });
            }

            const { insuranceExpDate, polutionExpDate } = req.body;

            let insuranceImageUrl = "";
            let PolutionImageUrl = "";

            const files = req.files as {
                [fieldname: string]: Express.Multer.File[] | undefined;
            };


            if (files?.insuranceImage?.[0]) {
                const insuranceImage = files.insuranceImage[0];
                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: "bike-insurance" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    ).end(insuranceImage.buffer);
                });
                insuranceImageUrl = (result as any).secure_url;
            }

            if (files?.PolutionImage?.[0]) {
                const PolutionImage = files.PolutionImage[0];
                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: "bike-pollution" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    ).end(PolutionImage.buffer);
                });
                PolutionImageUrl = (result as any).secure_url;
            }

            const bike = await this.hostRepository.editBike(
                new Date(insuranceExpDate),
                new Date(polutionExpDate),
                insuranceImageUrl,
                PolutionImageUrl,
                bikeId
            )

            return res.status(OK).json({ success: true, bike });
        } catch (error) {
            console.error("Error in service layer edit bike:", error);
            throw error;
        }
    }

    async findOrder(userId: string): Promise<IOrder[] | undefined> {
        try {
            return await this.hostRepository.getOrder(userId)

        } catch (error) {
            throw error
        }
    }

    async orderDetails(orderId: string): Promise<any> {
        try {
            const order = await this.hostRepository.findOrder(orderId)

            if (!order) {
                throw new Error("Order not found");
            }

            const bike = await this.hostRepository.bikeSingleView(order?.bikeId.toString())

            if (!bike) {
                throw new Error("Bike details not found");
            }

            const user = await this.hostRepository.findUser(order?.userId.toString())
            if (!user) {
                throw new Error("User details not found")
            }

            return {
                order,
                bike,
                user,
            };
        } catch (error) {
            throw error
        }
    }


}

export default HostServices;
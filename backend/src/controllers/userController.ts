import { Request, Response } from 'express';
import { STATUS_CODES } from "../constants/httpStatusCodes";
import { CreateJWT } from '../utils/generateToken';
import { IUserService } from '../interfaces/user/IUserService';
import { IOtpService } from '../interfaces/otp/IOtpService';
import { ResponseModel } from '../utils/responseModel';

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND, FORBIDDEN } = STATUS_CODES;
const jwtHandler = new CreateJWT()


export class UserController {

    constructor(private UserServices: IUserService, private OtpServices: IOtpService) { }

    milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);

    async userSignup(req: Request, res: Response): Promise<Response | void> {
        try {
            const userData = req.body;
            console.log("user data kitti",userData)
            const userFound = await this.UserServices.userSignup(userData);
            console.log("userne founded : ",userFound)

            if (!userFound) {
                await this.OtpServices.generateAndSendOtp(req.body.email)

                const userWallet = await this.UserServices.createWallet()

                userData.wallet = userWallet._id;

                if (!userWallet) {
                    return res.status(BAD_REQUEST).json(ResponseModel.error("wallet not created"))
                }

                await this.UserServices.saveUser(userData);

                return res.status(OK).json(ResponseModel.success('OTP sent for verification', { email: req.body.email }));

            } else {
                return res.status(BAD_REQUEST).json(ResponseModel.error('The email is already in use!'));
            }
        } catch (error) {
            console.log(error as Error)
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))
        }
    }

    async login(req: Request, res: Response): Promise<Response | void> {
        try {
            const { email, password } = req.body
            const isUserPresent = await this.UserServices.login(email)
            console.log(32, isUserPresent);


            if (!isUserPresent) {
                return res.status(NOT_FOUND).json(ResponseModel.error('No account found with this email. Please register first.'));
            }
            const isPasswordMatch = await isUserPresent.matchPassword(password);

            if (!isPasswordMatch) {
                return res.status(BAD_REQUEST).json(ResponseModel.error('Incorrect password. Please try again.'));
            }

            if (isUserPresent.isBlocked) {
                return res.status(FORBIDDEN).json(ResponseModel.error('User is blocked by the admin'))
            }

            // const time = this.milliseconds(0, 1, 0);
            // const refreshTokenExpiryTime = this.milliseconds(0, 3, 0);

            const userAccessToken = jwtHandler.generateToken(isUserPresent._id.toString());
            const userRefreshToken = jwtHandler.generateRefreshToken(isUserPresent._id.toString());

            console.log(11, userAccessToken);
            console.log(22, userRefreshToken);

                            return res.status(OK)
                .cookie('user_access_token', userAccessToken, {
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    secure: process.env.NODE_ENV === 'production' ? true : false,
                    httpOnly: true,
                    domain: process.env.NODE_ENV === 'production' ? '.2wheleeee.store' : undefined
                })
                .cookie('user_refresh_token', userRefreshToken, {
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    secure: process.env.NODE_ENV === 'production' ? true : false,
                    httpOnly: true,
                    domain: process.env.NODE_ENV === 'production' ? '.2wheleeee.store' : undefined
                })
                .json(ResponseModel.success('Login successfull', {
                    user: {
                        email: isUserPresent.email,
                        name: isUserPresent.name,
                        profile_picture: isUserPresent.profile_picture,
                        userId: isUserPresent._id
                    },
                    userAccessToken,
                    userRefreshToken
                }));
        } catch (error) {
            console.log('Error during login:', error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('An unexpected error occurred. Please try again later.', error as Error));
        }
    }

    async logout(req: Request, res: Response): Promise<Response | void> {
        try {
            return res
                .clearCookie('user_access_token', {
                    httpOnly: true, // cookie can't be accessed via JavaScript (prevents XSS attacks).
                    secure: process.env.NODE_ENV === 'production',   // cookie is sent only over HTTPS (ensure your environment supports HTTPS).
                    sameSite: 'none',  // prevents cross-site requests (adds CSRF protection)
                    domain: process.env.NODE_ENV === 'production' ? '.2wheleeee.store' : undefined,
                })
                .clearCookie('user_refresh_token', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'none',
                    domain: process.env.NODE_ENV === 'production' ? '.2wheleeee.store' : undefined,
                })
                .status(OK)
                .json(ResponseModel.success('Logged out successfully'))
        } catch (error) {
            console.log(error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))
        }
    }

    async forgotPassword(req: Request, res: Response): Promise<Response | void> {
        try {
            const { email } = req.body

            if (!email) {
                return res.status(NOT_FOUND).json({ success: false, message: "Email is required." })
            }

            //const forgotPassword: any = await this._userUsecase.forgotPassword(req.body.email);


            // if (forgotPassword.status == 400) {
            //     return res.status(forgotPassword.status).json(forgotPassword.message);
            // }

            // return res.status(forgotPassword.status).json(forgotPassword.message);


        } catch (error) {
            console.log(error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))

        }
    }

    async getProfile(req: Request, res: Response): Promise<Response | void> {
        try {
            const email = req.query.email ?? '';
            if (!email || typeof email !== 'string') {
                return res.status(BAD_REQUEST).json(ResponseModel.error('Invalid email provided'));
            }
            const userDetails = await this.UserServices.getProfile(email);
            return res.status(OK).json(ResponseModel.success('Success', userDetails));
        } catch (error) {
            console.log(error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))
        }
    }

    async editUser(req: Request, res: Response): Promise<Response | void> {
        try {
            const { email, ...userData } = req.body;
            if (!email) {
                return res.status(NOT_FOUND).json(ResponseModel.error("Email is required"));
            }
            const updatedUserData = await this.UserServices.editProfile(email, userData, req)

            if (!updatedUserData) {
                return res.status(NOT_FOUND).json(ResponseModel.error("User not found"));
            }

            return res.status(OK).json(ResponseModel.success("User profile updated successfully", {
                data: updatedUserData,
                user: {
                    email: updatedUserData.email,
                    name: updatedUserData.name,
                    profile_picture: updatedUserData.profile_picture,
                    userId: updatedUserData._id
                },
            }))
        } catch (error) {
            console.error("Controller error updating profile:", error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))
        }
    }

    async editUserDocuments(req: Request, res: Response): Promise<Response | void> {
        try {
            const updatedUserDocuments = await this.UserServices.editUserDocuments(req, res)
            return res.status(OK).json(ResponseModel.success('User profile updated successfully', { data: updatedUserDocuments }))
        } catch (error) {
            console.log(error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error))
        }
    }

    async GetBikeList(req: Request, res: Response): Promise<Response | void> {
        try {
            const { page = 1, limit = 10, search = '', fuelType, minRent, maxRent } = req.query;

            const result = await this.UserServices.GetBikeList({
                page: Number(page),
                limit: Number(limit),
                search: String(search),
                fuelType: String(fuelType),
                minRent: Number(minRent),
                maxRent: Number(maxRent),
            });

            return res.status(OK).json(ResponseModel.success('Get Bike List', {
                bikeList: result.bikeList,
                totalBikes: result.totalBikes,
                totalPages: result.totalPages,
            }))
        } catch (error) {
            console.error('Error in controller GetBikeList:', error);
            res.status(500).json({ success: false, message: 'Failed to get bike list' });
        }
    }

    async getBikeDetails(req: Request, res: Response): Promise<Response | void> {
        try {
            const { id } = req.params;
            const bike = await this.UserServices.getBikeDetails(id)
            if (!bike) return res.status(NOT_FOUND).json(ResponseModel.error('Bike not found'));
            return res.status(OK).json(ResponseModel.success('Bike Details', bike))
        } catch (error) {
            console.error("Error getting bike details :", error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error("Failed to get bike Deatils", error as Error));
        }
    }

    async checkBlockedStatus(req: Request, res: Response): Promise<Response | void> {
        try {
            const { email } = req.body;
            const user = await this.UserServices.findUserByEmail(email)

            if (!user) {
                return res.status(NOT_FOUND).json(ResponseModel.error('User not found'));

            }

            return res.status(OK).json(ResponseModel.success('success', { isBlocked: user.isBlocked }));
        } catch (error) {
            console.error('Error checking user status:', error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('Internal server error', error as Error));
        }
    }

    async getOrderList(req: Request, res: Response): Promise<Response | void> {
        try {

            const { userId } = req.query;

            if (!userId) {
                return res.status(NOT_FOUND).json(ResponseModel.error("User ID is required"));
            }

            const orders = await this.UserServices.getOrder(userId.toString())

            if (orders.length === 0) {
                console.log("no order get for the user ")
                return res.status(OK).json(ResponseModel.success('No orders found for this user', { orders: [] }));
            }
            return res.status(OK).json(ResponseModel.success('Order List Getting Success', { order: orders || [] }))
        } catch (error) {
            console.log("error in user controller getting order list : ", error)
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error));

        }
    }

    async getOrderDetails(req: Request, res: Response): Promise<Response | void> {
        try {
            const orderDetails = await this.UserServices.orderDetails(req.params.orderId)

            return res.status(OK).json(ResponseModel.success("Order Details Get", orderDetails))
        } catch (error) {
            console.log("error in admin controller getting order details : ", error)
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error));
        }
    }

    async earlyReturn(req: Request, res: Response): Promise<Response | void> {
        try {
            const { orderId } = req.params;

            const updatedOrder = await this.UserServices.findOrderAndUpdate(orderId)

            if (!updatedOrder) {
                return res.status(NOT_FOUND).json(ResponseModel.error("Order not found"));
            }

            return res.status(OK).json(ResponseModel.success("Order status updated successfully", updatedOrder));


        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error));
        }
    }


    async returnOrder(req: Request, res: Response): Promise<Response | void> {
        try {
            const { orderId } = req.params;
            const updatedOrder = await this.UserServices.returnOrder(orderId)

            if (!updatedOrder) {
                return res.status(NOT_FOUND).json(ResponseModel.error("Order not found"));
            }

            return res.status(OK).json(ResponseModel.success("Order status updated successfully", updatedOrder));
        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error));
        }
    }

    async submitReview(req: Request, res: Response) {
        try {
            const { reviewerId, bikeId, rating, feedback } = req.body;

            if (!reviewerId || !bikeId || !rating) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("All fields are required."));
            }

            const allreadyReviewed = await this.UserServices.userAlreadyReviewed(reviewerId)
            if (allreadyReviewed) {
                return res.status(BAD_REQUEST).json(ResponseModel.error('User Already submitted a Review'))
            }
            const review = await this.UserServices.submitReview(reviewerId, bikeId, rating, feedback)

            if (!review) {
                return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error("Failed to submit review."));

            }

            return res.status(OK).json(ResponseModel.success("Review submitted successfully!", review));
        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error));
        }
    }

    async getReviews(req: Request, res: Response) {
        try {
            const { bikeId } = req.params;

            if (!bikeId) {
                return res.status(BAD_REQUEST).json(ResponseModel.error("Bike ID is required"));
            }

            const reviews = await this.UserServices.findReviews(bikeId)


            return res.status(OK).json(ResponseModel.success('Get reviews of the bike', { data: reviews }));

        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error));
        }
    }


    async isBikeAlreadyBooked(req: Request, res: Response) {
        try {
            const bikeId = req.params.bikeId
            console.log(12121, bikeId)

            let bikeOrdered: boolean | undefined = false

            const allOrders = await this.UserServices.allOrders()

            console.log(2222, allOrders);


            bikeOrdered = allOrders?.some(order =>
                order.bikeId.toString() === bikeId && order.status !== "Completed"
            );

            console.log("Bike Ordered:", bikeOrdered);
            return res.status(OK).json(ResponseModel.success("This bike order status : ", { bikeOrdered: bikeOrdered }))


        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('INTERNAL SERVER ERROR', error as Error));
        }
    }

}

export default UserController;


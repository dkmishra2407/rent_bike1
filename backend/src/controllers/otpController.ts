import { Request, Response } from 'express';
import { STATUS_CODES } from "../constants/httpStatusCodes";
import userModel from '../models/userModels';
import { CreateJWT } from '../utils/generateToken';
import { IOtpService } from '../interfaces/otp/IOtpService';
import { ResponseModel } from '../utils/responseModel';
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = STATUS_CODES;
const jwtHandler = new CreateJWT()


export class OtpController {

    constructor(private OtpServices: IOtpService) { }

    milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);

    async verifyOtp(req: Request, res: Response): Promise<Response | void> {
        try {
            let data = req.body

            const otpMatched = await this.OtpServices.verifyOtp(data)

            if (otpMatched) {
                const userEmail = data.userId

                let userDetails = await userModel.findOne(
                    { email: userEmail },
                    'email name profile_picture _id'
                );

                if (!userDetails) {
                    return res.status(BAD_REQUEST).json(ResponseModel.error('User not found!'));
                }

                const time = this.milliseconds(0, 30, 0);
                const refreshTokenExpiryTime = this.milliseconds(48, 0, 0);

                const userAccessToken = jwtHandler.generateToken(userDetails?._id.toString());
                const userRefreshToken = jwtHandler.generateRefreshToken(userDetails?._id.toString());

                return res.status(OK).cookie('user_access_token', userAccessToken, {
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    secure: process.env.NODE_ENV === 'production' ? true : false,
                    httpOnly: true,
                    domain: process.env.NODE_ENV === 'production' ? '.2wheleeee.store' : undefined
                }).cookie('user_refresh_token', userRefreshToken, {
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    secure: process.env.NODE_ENV === 'production' ? true : false,
                    httpOnly: true,
                    domain: process.env.NODE_ENV === 'production' ? '.2wheleeee.store' : undefined
                }).json(
                    ResponseModel.success('OTP verification successful, account verified.', {
                        userData: userDetails,
                        userAccessToken: userAccessToken,
                        userRefreshToken: userRefreshToken
                    })
                );

            } else {
                return res.status(BAD_REQUEST).json(ResponseModel.error('OTP verification failed! No matching OTP'));
            }
        } catch (error) {
            console.log(error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('Internal server error', error as Error));
        }
    }

    async resendOtp(req: Request, res: Response): Promise<Response | void> {
        try {
            const email = req.body.email
            await this.OtpServices.generateAndSendOtp(email);
            return res.status(OK).json(ResponseModel.success('OTP resent successfully'));
        } catch (error) {
            console.log(error);
            return res.status(INTERNAL_SERVER_ERROR).json(ResponseModel.error('Internal server error', error as Error));
        }
    }

}

export default OtpController;


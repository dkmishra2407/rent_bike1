import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv';
import { CreateJWT } from '../utils/generateToken';
import UserRepository from '../repositories/userRepository';
import { STATUS_CODES } from '../constants/httpStatusCodes';

import { UserInterface } from '../interfaces/IUser';
import { ResponseModel } from '../utils/responseModel';

const { UNAUTHORIZED, FORBIDDEN } = STATUS_CODES

const jwt = new CreateJWT();
const userRepository = new UserRepository();
dotenv.config()


declare global {
    namespace Express {
        interface Request {
            userId?: string,
            user?: UserInterface | null,
        }
    }
}

const userAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    let token = req.cookies.user_access_token;
    let refresh_token = req.cookies.user_refresh_token;

    if (!refresh_token) {
        return res.status(UNAUTHORIZED).json(ResponseModel.error('User Token expired or not available'))
    }

    if (!token) {
        try {
            const newAccessToken = await refreshAccessToken(refresh_token);
            console.log(111,newAccessToken);
            
            // const accessTokenMaxAge = 30 * 60 * 1000;

            res.cookie('user_access_token', newAccessToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production' ? true : false,
                httpOnly: true,
                domain: process.env.NODE_ENV === 'production' ? '.2wheleeee.store' : undefined
            });
            token = newAccessToken;
        } catch (error) {
            return res.status(UNAUTHORIZED).json(ResponseModel.error('Failed to refresh token'));
        }
    }

    try {
        if (!token) {
            token = req.cookies.user_access_token;
        }

        console.log(222,token);
        
        const decoded = jwt.verifyToken(token);

        console.log(333,decoded);

        if (decoded?.success) {
            let user = await userRepository.getUserById(decoded.decoded?.data?.toString());

            console.log(132, user);

            if (user?.isBlocked) {
                return res.status(FORBIDDEN).json(ResponseModel.error("User is blocked by admin!"))

            } else {
                req.userId = decoded.decoded?.data?.toString();
                req.user = user;
                next();
            }
        } else {
            const newAccessToken = await refreshAccessToken(refresh_token);
            console.log(135,newAccessToken);
            
            // const accessTokenMaxAge = 30 * 60 * 1000;

            res.cookie('user_access_token', newAccessToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production' ? true : false,
                httpOnly: true,
                domain: process.env.NODE_ENV === 'production' ? '.2wheleeee.store' : undefined
            });
            token = newAccessToken;
            // return res.status(UNAUTHORIZED).json(ResponseModel.error(decoded?.message))
        }

    } catch (err: any) {
        console.log('the error is here.');
        console.log(err);
        return res.status(UNAUTHORIZED).json(ResponseModel.error("Authentication failed!"));
    }
}

const refreshAccessToken = async (refreshToken: string): Promise<string> => {
    if (!refreshToken) {
        throw new Error('No refresh token found');
    }
    try {
        const decoded = jwt.verifyRefreshToken(refreshToken);

        if (!decoded?.decoded?.data) {
            throw new Error('Decoded data is invalid or missing');
        }

        const newAccessToken = jwt.generateToken(decoded?.decoded.data);
        if (!newAccessToken) {
            throw new Error('Failed to generate new access token');
        }
        return newAccessToken;
    } catch (error) {
        console.log(error);
        throw new Error('Invalid refresh token');
    }
};

export default userAuth;
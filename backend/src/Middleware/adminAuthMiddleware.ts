import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { CreateJWT } from '../utils/generateToken';

dotenv.config();

const jwtHandler = new CreateJWT();

export const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token = req.cookies.admin_access_token;
    let refreshToken = req.cookies.admin_refresh_token;

    if (!refreshToken) {
        res.status(401).json({ success: false, message: 'Admin Token expired or not available' });
        return
    }

    if (!token) {
        try {
            const newAccessToken = await refreshAdminAccessToken(refreshToken);
            //const accessTokenExpiresIn = 30 * 60 * 1000;

            res.cookie('admin_access_token', newAccessToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production' ? true : false,
                domain: process.env.NODE_ENV === 'production' ? '.2wheleeee.store' : undefined
            });

            token = newAccessToken;
        } catch (error) {
            res.status(401).json({ success: false, message: 'Failed to refresh token' });
            return
        }
    }

    try {
        const decoded = jwtHandler.verifyToken(token);

        if (decoded?.success && decoded.decoded?.data === process.env.ADMIN_EMAIL) {
            next(); // Proceed to the next middleware or route handler
        } else {
            const newAccessToken = await refreshAdminAccessToken(refreshToken);
            //const accessTokenExpiresIn = 30 * 60 * 1000;

            res.cookie('admin_access_token', newAccessToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production' ? true : false,
                domain: process.env.NODE_ENV === 'production' ? '.2wheleeee.store' : undefined
            });

            token = newAccessToken;
            // res.status(401).json({ success: false, message: 'Invalid token' });
            // return
        }
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ success: false, message: 'Token expired' });
            return
        } else {
            res.status(401).json({ success: false, message: 'Token verification failed' });
            return
        }
    }
};

// Helper function to refresh access token using the refresh token
const refreshAdminAccessToken = async (refreshToken: string): Promise<string> => {
    if (!refreshToken) {
        throw new Error('No refresh token found');
    }

    try {
        const decoded = jwtHandler.verifyRefreshToken(refreshToken);

        if (!decoded?.decoded?.data || decoded.decoded.data !== process.env.ADMIN_EMAIL) {
            throw new Error('Invalid or missing decoded data');
        }

        const newAccessToken = jwtHandler.generateToken(decoded.decoded.data);

        if (!newAccessToken) {
            throw new Error('Failed to generate new access token');
        }

        return newAccessToken;
    } catch (error) {
        console.error('Error refreshing admin access token:', error);
        throw new Error('Invalid refresh token');
    }
};

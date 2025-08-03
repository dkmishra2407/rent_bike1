import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
import OTPModel from '../models/otpModels';
import bcrypt from "bcrypt";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TRANSPORTER_EMAIL,
        pass: process.env.TRANSPORTER_PASS,
    }
})


export const generateAndSendOTP = async (toEmail: string): Promise<string> => {
    const otp: string | null = generateRandomOTP()
    const hashedOTP = await bcrypt.hash(otp, 10);
    await OTPModel.findOneAndUpdate(
        { email: toEmail },
        {
            $set: {
                hashedOTP, 
                expireAt: new Date(Date.now() + 60 * 1000), 
            },
        },
        { upsert: true, new: true } 
    );

    const mailOptions = {
        from: process.env.TRANSPORTER_EMAIL,
        to: toEmail,
        subject: 'OTP Verification',
        text: `Welcome to MOTOHOST. Your OTP for registration is: ${otp}`
    }

    await transporter.sendMail(mailOptions)
    return otp
}



export function generateRandomOTP(): string {
    const otpLength = 6
    const min = Math.pow(10, otpLength - 1)
    const max = Math.pow(10, otpLength) - 1
    const randomOTP = Math.floor(min + Math.random() * (max - min + 1))
    return randomOTP.toString()
}
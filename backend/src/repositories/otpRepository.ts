import OTPModel from '../models/otpModels';
import userModel from '../models/userModels';
import bcrypt from 'bcrypt';
import { IOtpRepository } from '../interfaces/otp/IOtpRepository';
import BaseRepository from './baseRepository';
import { UserInterface } from '../interfaces/IUser';
import { OTPInterface } from '../interfaces/IOtp';

class OtpRepository implements IOtpRepository{

    private userRepository: BaseRepository<UserInterface>;
    private otpRepository : BaseRepository<OTPInterface>;

    constructor() {
        this.userRepository = new BaseRepository(userModel);
        this.otpRepository = new BaseRepository(OTPModel);
    }

    async saveOtp(email: string, hashedOTP: string): Promise<boolean> {
        try {
            await this.otpRepository.findOneAndUpdate(
                { email },
                {
                    $set: {
                        hashedOTP,
                        expireAt: new Date(Date.now() + 60 * 1000),
                    },
                },
                { upsert: true, new: true }
            );

            return true
        } catch (error) {
            console.log("Error in otp Repository layer save otp ", error);
            throw error;
        }
    }

    async checkOtp(email: string, otp: number): Promise<boolean> {
        try {
            const otpRecord = await this.otpRepository.findOne({ email })

            if (!otpRecord) {
                console.log(4,'OTP record not found');
                return false;
            }

            const isMatch = await bcrypt.compare(otp.toString(), otpRecord.hashedOTP);

            if (!isMatch) {
                console.log(5,'Invalid OTP');
                return false;
            }
            await this.userRepository.updateOne({ email }, { $set: { isVerified: true } })
            return true;

        } catch (error) {
            console.log("error showing when check otp is correct ", error);
            throw error;
        }
    }

}

export default OtpRepository;
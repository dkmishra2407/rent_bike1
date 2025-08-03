import { Document } from "mongoose";

export interface OTPInterface extends Document {
  email: string;
  hashedOTP: string;
  expireAt: Date;
}
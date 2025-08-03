import mongoose, { Schema, Model } from "mongoose";
import { OTPInterface } from "../interfaces/IOtp";

const otpSchema: Schema<OTPInterface> = new Schema({
  email: {
    type: String,
    required: true,
  },
  hashedOTP: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    default: Date.now,
    expires: 3540,
  },
});

const OTPModel: Model<OTPInterface> = mongoose.model<OTPInterface>("OTP", otpSchema);
export default OTPModel;

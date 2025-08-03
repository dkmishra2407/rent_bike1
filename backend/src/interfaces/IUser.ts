import mongoose, { Document, ObjectId } from "mongoose";

export interface UserInterface extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    password: string;
    email: string;
    phoneNumber: number;
    isBlocked: boolean;
    isVerified: boolean;
    profile_picture: string;
    dateOfBirth: Date;
    address: string | null;
    isUser: boolean;
    license_number: string;
    license_Exp_Date: Date;
    license_picture_front: string;
    license_picture_back: string;
    wallet: ObjectId

    matchPassword: (enteredPassword: string) => Promise<boolean>;
}

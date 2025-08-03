import mongoose, { Schema, Model } from "mongoose";
import bcrypt from 'bcrypt';
import { UserInterface } from "../interfaces/IUser";

const userSchema: Schema<UserInterface> = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
    },
    password: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
    },
    address: {
        type: String,
        default: '',
    },
    profile_picture: {
        type: String,
        default: ''
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isUser: {
        type: Boolean,
        default: false
    },
    license_number: {
        type: String
    },
    license_Exp_Date: {
        type: Date
    },
    license_picture_front: {
        type: String,
        default: ''
    },
    license_picture_back: {
        type: String,
        default: ''
    },
    wallet: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet'
    }
},
    { timestamps: true }
);

userSchema.pre('save', async function (this: UserInterface, next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
});

userSchema.methods.matchPassword = async function (this: UserInterface, enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<UserInterface> = mongoose.model<UserInterface>('User', userSchema);
export default userModel;
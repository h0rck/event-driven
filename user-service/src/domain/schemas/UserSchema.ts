import mongoose, { Schema } from 'mongoose';
import { User } from '../entities/User.js';

const userSchema = new Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, {
    timestamps: true
});

export const UserModel = mongoose.model<User>('User', userSchema);
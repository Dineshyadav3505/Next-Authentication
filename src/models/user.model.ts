import mongoose, { Schema, Document } from "mongoose";

// Define the user interface
interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    isAdmin: boolean;
    isVerified: boolean;
    forgotPasswordToken: string | null;
    forgotPasswordExpires: Date | null;
    verifyToken: string | null;
    verifyExpires: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

// Define the user schema
const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            unique: true,
            required: [true, "Username is required"],
            trim: true,
            minlength: [3, "Username must be at least 3 characters long"],
            maxlength: [30, "Username must be at most 30 characters long"]
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Email is required"],
            match: [/\S+@\S+\.\S+/, 'Invalid email format'],
            lowercase: true, //  Convert email to lowercase
            trim: true // Trim whitespace
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters long"] // Password must be at least 6 characters long
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        forgotPasswordToken: {
            type: String,
            default: null // Optional: Default to null
        },
        forgotPasswordExpires: {
            type: Date,
            default: null // Optional: Default to null
        },
        verifyToken: {
            type: String,
            default: null // Optional: Default to null
        },
        verifyExpires: {
            type: Date,
            default: null // Optional: Default to null
        }
    },
    { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Ensure the model is created only once
const User = mongoose.models.users || mongoose.model<IUser>('users', userSchema);

export default User;
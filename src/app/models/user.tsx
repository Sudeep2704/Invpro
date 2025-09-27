// src/app/models/user.ts
import mongoose, { Schema, models, Model } from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  password: string; // hashed
  role: string;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },     // ✅ not "name"
    email:    { type: String, required: true, unique: true, index: true },
    phone:    { type: String, default: "" },
    company:  { type: String, default: "" },
    address:  { type: String, default: "" },
    password: { type: String, required: true },
    role:     { type: String, default: "user" },
  },
  { timestamps: true } // keeps createdAt/updatedAt
);

// Important in Next.js dev to avoid OverwriteModelError
const User: Model<IUser> = models.User || mongoose.model<IUser>("User", UserSchema);
export default User;

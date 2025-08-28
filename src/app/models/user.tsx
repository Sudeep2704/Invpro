// src/models/User.ts
import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // hashed
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);

import mongoose from "mongoose";
import type { IUser } from "../types/index.js";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, unique: true, trim: true, required: true },
    clerkId: { type: String, unique: true, sparse: true, required: true },
    image: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;

import { clerkClient } from "@clerk/express";
import User from "../models/Users.js";

const makeAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    if (!email) {
      throw new Error("ADMIN_EMAIL is missing");
    }

    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true },
    );

    if (!user) {
      throw new Error("User not found");
    }

    if (user.clerkId) {
      await clerkClient.users.updateUserMetadata(user.clerkId, {
        publicMetadata: { role: "admin" },
      });
    }
  } catch (error: any) {
    console.error("Error making user admin:", error.message || "Unknown error");
  }
};

export default makeAdmin;

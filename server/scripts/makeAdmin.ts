import { clerkClient } from "@clerk/express";
import User from "../models/Users.js";

const makeAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;

    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" as string },
    );

    if (user) {
      await clerkClient.users.updateUserMetadata(user.clerkId as string, {
        publicMetadata: { role: "admin" },
      });
    }
  } catch (error: any) {
    console.error("Error making user admin:", error.message || "Unknown error");
  }
};

export default makeAdmin;

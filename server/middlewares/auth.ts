import User from "../models/Users.js";
import type { Middleware } from "../types/express.js";

export const Protect: Middleware = async (req, res, next) => {
  try {
    const { userId } = await req.auth();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Error", error);

    return res.status(500).json({
      success: false,
      message: "Authentication Failed",
    });
  }
};

export const authorize = (...roles: string[]) => {
  const authorizeMiddleware: Middleware = async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "User role is not authorized to access this route",
      });
    }

    next();
  };

  return authorizeMiddleware;
};

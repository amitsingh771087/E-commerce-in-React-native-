import User from "../models/Users.js";
import Product from "../models/Products.js";
import Order from "../models/Order.js";
import type { Controller } from "../types/express.js";

// GET /api/admin/stats
export const getDashboardStats: Controller = async (req, res) => {
  try {
    const [totalUser, totalProducts, totalOrders, revenueResult, recentOrders] =
      await Promise.all([
        User.countDocuments(),

        Product.countDocuments(),

        Order.countDocuments(),

        Order.aggregate([
          {
            $match: {
              orderStatus: { $ne: "cancelled" },
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: {
                $sum: "$totalAmount",
              },
            },
          },
        ]),

        Order.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .populate("user", "name email"),
      ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    return res.status(200).json({
      success: true,
      data: {
        totalUser,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

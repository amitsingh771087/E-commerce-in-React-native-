// get dashboard stats

import User from "../models/Users.js";
import Product from "../models/Products.js";
import Order from "../models/Order.js";
import type { Controller } from "../types/express.js";

// GET /api/admin/stats
export const getDashboardStats: Controller = async (req, res) => {
  try {
    const totalUser = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const validOrders = await Order.find({ orderStatus: { $ne: "cancelled" } });
    const totalRevenue = validOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );

    const recentOrders = await Order.find()
      .sort("-createdAt")
      .limit(5)
      .populate("user", "name email");

    res.status(201).json({
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
    res.status(500).json({ success: false, message: error.message });
  }
};

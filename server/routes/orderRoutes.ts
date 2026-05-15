import express from "express";
import { authorize, Protect } from "../middlewares/auth.js";
import {
  createOrder,
  getAllOrders,
  getOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const OrderRoutes = express.Router();

// get user orders
OrderRoutes.get("/", Protect, getOrders);

// get single order
OrderRoutes.get("/:id", Protect, getOrder);

// create order from cart
OrderRoutes.post("/", Protect, createOrder);

// Update order Status (Admin only)
OrderRoutes.put("/:id/status", Protect, authorize("admin"), updateOrderStatus);

// get All Orders (Admin only)
OrderRoutes.get("/admin/all", Protect, authorize("admin"), getAllOrders);

export default OrderRoutes;

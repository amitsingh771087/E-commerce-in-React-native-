import express from "express";
import { Protect } from "../middlewares/auth.js";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItems,
  updateCartItems,
} from "../controllers/cartController.js";

const cartRouter = express.Router();

// Get User Cart
cartRouter.get("/", Protect, getCart);

// Add Item to Cart
cartRouter.post("/add", Protect, addToCart);

// update Item Quantity
cartRouter.post("/item/:productId", Protect, updateCartItems);

// Remove  Item from Cart
cartRouter.delete("/item/:productId", Protect, removeCartItems);

// Clear Cart
cartRouter.delete("/", Protect, clearCart);

export default cartRouter;

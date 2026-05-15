import express from "express";
import {
  addWishlistItem,
  ClearWishlist,
  getWishlistItems,
  removeItemFromWishlist,
} from "../controllers/wishlistController.js";
import { Protect } from "../middlewares/auth.js";

const wishlistRoutes = express.Router();

// Get Wishlist Items
wishlistRoutes.get("/", Protect, getWishlistItems);

// Add Item To Wishlist
wishlistRoutes.post("/", Protect, addWishlistItem);

// Remove Item From Wishlist
wishlistRoutes.delete("/:productId", Protect, removeItemFromWishlist);

// Clear Wishlist
wishlistRoutes.delete("/", Protect, ClearWishlist);

export default wishlistRoutes;

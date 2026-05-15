import Product from "../models/Products.js";
import Wishlist from "../models/Wishlist.js";
import type { Controller } from "../types/express.js";

// Get Item From Wishlist
// GET /api/wishlist
export const getWishlistItems: Controller = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    }).populate("products", "name price images stock");

    res.status(200).json({
      success: true,
      data: wishlist?.products || [],
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add Item to Wishlist
// POST /api/wishlist
export const addWishlistItem: Controller = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product Id is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user._id,
        products: [],
      });
    }

    const alreadyExists = wishlist.products.some(
      (item) => item.toString() === productId,
    );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    wishlist.products.push(productId);

    await wishlist.save();

    await wishlist.populate("products", "name price images stock");

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      data: wishlist,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove  Item from Wishlist
// DELETE /api/wishlist/:productId
export const removeItemFromWishlist: Controller = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.products = wishlist.products.filter(
      (item) => item.toString() !== productId,
    );

    await wishlist.save();

    await wishlist.populate("products", "name price images stock");

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      data: wishlist,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear Wishlist
// DELETE /api/wishlist
export const ClearWishlist: Controller = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.products = [];

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
      data: wishlist,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import Cart from "../models/Cart.js";
import Product from "../models/Products.js";
import type { Controller } from "../types/express.js";

// get user Cart
// GET /api/cart
export const getCart: Controller = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name images price stock",
    );
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add item to  Cart
// POST  /api/cart/add
export const addToCart: Controller = async (req, res) => {
  try {
    const { productId, quantity = 1, size } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    if (product.stock < quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient Stock" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }
    // Find item with same product and price
    const existingItem = cart.items.find((item) => {
      return item.product.toString() === productId && item.size === size;
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: "Insufficient Stock",
        });
      }

      existingItem.quantity = newQuantity;
      existingItem.price = product.price;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        size,
      });
    }
    cart.calculateTotal();
    await cart.save();

    await cart.populate("items.product", "name  images price stock");
    res.status(200).json({ success: true, data: cart });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update cart item quantity
// PUT  /api/cart/item/:productId
export const updateCartItems: Controller = async (req, res) => {
  try {
    const { quantity, size } = req.body;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not Found" });
    }
    const item = cart?.items.find(
      (item) => item.product.toString() === productId && item.size === size,
    );
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not in Cart" });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId || item.size !== size,
      );
    } else {
      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      if (product.stock < quantity) {
        return res
          .status(400)
          .json({ success: false, message: "Insufficient Stock" });
      }
      item.quantity = quantity;
    }
    cart?.calculateTotal();
    await cart?.save();
    await cart?.populate("items.product", "name  images price stock");

    res.status(200).json({ success: true, data: cart });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove cart item quantity
// DELETE  /api/cart/item/:productId
export const removeCartItems: Controller = async (req, res) => {
  try {
    const { productId } = req.params;
    const { size } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not Found" });
    }

    if (!size) {
      return res
        .status(400)
        .json({ success: false, message: "Size is required" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId || item.size !== size,
    );

    cart.calculateTotal();

    await cart.save();

    await cart.populate("items.product", "name images price stock");

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Clear Cart
// DELETE  /api/cart
export const clearCart: Controller = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.totalAmount = 0;
      await cart.save();
    }
    res.status(200).json({ success: true, data: cart });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

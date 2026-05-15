import mongoose, { Schema } from "mongoose";
import type { IProduct } from "../types/index.js";
import { describe } from "node:test";

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  images: [{ type: String }],
  sizes: [{ type: String }],
  category: {
    type: String,
    required: true,
    enum: ["Men", "Women", "Kids", "Shoes", "Accessories", "Bags", "Other"],
    default: "Other",
  },
  stock: { type: Number, required: true, default: 0, min: 0 },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

ProductSchema.index({
  name: "text",
  description: "text",
});

const Product = mongoose.model<IProduct>("Product", ProductSchema);

export default Product;

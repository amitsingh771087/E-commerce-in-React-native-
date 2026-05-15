import mongoose, { Schema } from "mongoose";
import type { IWishlist } from "../types/index.js";

const WishListItem = new Schema<IWishlist>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Wishlist = mongoose.model<IWishlist>("Wishlist", WishListItem);

export default Wishlist;

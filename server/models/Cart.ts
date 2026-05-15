import mongoose, { Schema } from "mongoose";
import type { ICart, ICartItem } from "../types/index.js";

const CartItemSchema = new mongoose.Schema<ICartItem>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  price: { type: Number, required: true, min: 0 },
  size: { type: String },
});

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
    totalAmount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

CartSchema.methods.calculateTotal = function (this: ICart) {
  this.totalAmount = this.items.reduce((total: number, items: ICartItem) => {
    return total + items.price * items.quantity;
  }, 0);
  return this.totalAmount;
};

const Cart = mongoose.model<ICart>("Cart", CartSchema);

export default Cart;

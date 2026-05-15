import mongoose, { Schema } from "mongoose";
import type { IAddress } from "../types/index.js";

const AddressSchema = new Schema<IAddress>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Home", "Work", "Other"],
      default: "Home",
    },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

AddressSchema.index({ user: 1, createdAt: -1 });

const Address = mongoose.model<IAddress>("Address", AddressSchema);

export const ensureAddressIndexes = async () => {
  const indexes = await Address.collection.indexes();

  for (const index of indexes) {
    const key = index.key as Record<string, number>;
    const indexName = index.name;
    const isStaleUniqueUserIndex =
      index.unique === true &&
      key.user === 1 &&
      Object.keys(key).length === 1 &&
      typeof indexName === "string";

    if (isStaleUniqueUserIndex) {
      await Address.collection.dropIndex(indexName);
    }
  }

  await Address.createIndexes();
};

export default Address;

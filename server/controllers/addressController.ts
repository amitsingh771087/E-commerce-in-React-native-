import Address from "../models/Address.js";
import type { Controller } from "../types/express.js";

// Get User Address

// GET /api/addresses
export const getAddresses: Controller = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({
      isDefault: -1,
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add new address
// POST /api/addresses
export const addAddress: Controller = async (req, res) => {
  try {
    const { type, street, city, state, zipCode, country, isDefault } = req.body;
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const newAddress = await Address.create({
      user: req.user._id,
      type,
      street,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault || false,
    });

    res.status(201).json({ success: true, data: newAddress });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update  address
// PUT /api/addresses
export const updateAddress: Controller = async (req, res) => {
  try {
    const { type, street, city, state, zipCode, country, isDefault } = req.body;

    let addressItem = await Address.findById(req.params.id);
    if (!addressItem) {
      return res
        .status(404)
        .json({ success: false, message: "Address Not Found" });
    }
    // insure user owns address

    if (addressItem.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized" });
    }

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    addressItem = await Address.findByIdAndUpdate(
      req.params.id,
      {
        type,
        street,
        city,
        state,
        zipCode,
        country,
        isDefault: isDefault || false,
      },
      { new: true },
    );

    res.status(201).json({ success: true, data: addressItem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Address
// DELETE /api/addresses/:id

export const deleteAddress: Controller = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address Not Found" });
    }

    // insure user owns address

    if (address.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized" });
    }

    await address.deleteOne({ _id: req.params.id });

    res.status(201).json({ success: true, message: "Address Deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

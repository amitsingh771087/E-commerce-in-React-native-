import express from "express";
import { Protect } from "../middlewares/auth.js";
import {
  addAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../controllers/addressController.js";

const AddressRoutes = express.Router();

// get Address
AddressRoutes.get("/", Protect, getAddresses);

// Add Address
AddressRoutes.post("/", Protect, addAddress);

// Update Address
AddressRoutes.put("/:id", Protect, updateAddress);

// Delete Address
AddressRoutes.delete("/:id", Protect, deleteAddress);

export default AddressRoutes;

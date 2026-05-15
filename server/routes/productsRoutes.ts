import express from "express";
import {
  createProducts,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import upload from "../middlewares/upload.js";
import { authorize, Protect } from "../middlewares/auth.js";

const ProductRoutes = express.Router();

// get All Products
ProductRoutes.get("/", getProducts);

// get All Products
ProductRoutes.get("/:id", getProduct);

// create Product (Admin only)
ProductRoutes.post(
  "/",
  Protect,
  authorize("admin"),
  upload.array("images", 5),
  createProducts,
);
// update Product (Admin only)
ProductRoutes.put(
  "/:id",
  Protect,
  authorize("admin"),
  upload.array("images", 5),
  updateProduct,
);
// Delete Product (Admin only)
ProductRoutes.delete("/:id", Protect, authorize("admin"), deleteProduct);

export default ProductRoutes;

import express from "express";
import { authorize, Protect } from "../middlewares/auth.js";
import { getDashboardStats } from "../controllers/adminController.js";

const AdminRoutes = express.Router();

AdminRoutes.get("/", Protect, authorize("admin"), getDashboardStats);

export default AdminRoutes;

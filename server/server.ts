import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhook } from "./controllers/webhooks.js";
import ProductRoutes from "./routes/productsRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import OrderRoutes from "./routes/orderRoutes.js";
import AddressRoutes from "./routes/addressRoutes.js";
import AdminRoutes from "./routes/adminRoutes.js";

const app = express();

// connect to MongoDB

await connectDB();
// Clerk Webhook Route
app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhook);

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});

app.use("/api/products", ProductRoutes);
app.use("/api/cart", cartRouter);
app.use("/api/orders", OrderRoutes);
app.use("/api/addresses", AddressRoutes);
app.use("/api/admin", AdminRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhook } from "./controllers/webhooks.js";

const app = express();

// connect to MongoDB

await connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

const port = process.env.PORT || 3000;

app.post("/apo/clerk", express.raw({ type: "application/json" }), clerkWebhook);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

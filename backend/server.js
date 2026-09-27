import express from "express";
import "dotenv/config";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analtticsRoutes from "./routes/analytics.route.js";

import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 5000;
const __dirName = path.resolve();

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analtticsRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirName, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirName, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`E-commerce server is running on http://localhost:${PORT}`);
});

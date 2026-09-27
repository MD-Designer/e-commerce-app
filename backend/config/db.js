import mongoose from "mongoose";
import dns from "dns/promises"
dns.setServers(["1.1.1.1", "1.0.0.1"])

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected ${conn.connection.host}`);
  } catch (error) {
    console.log("Failed to Connecting to MongoDB", error.message);
    process.exit(1);
  }
};

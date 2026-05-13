import mongoose from "mongoose";

const mongourl = process.env.MONGODB_URI as string;

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB Connected  ");
    });

    await mongoose.connect(process.env.MONGODB_URI as string);
  } catch (error) {
    console.log("MongoDB Connection Failed", error);
    process.exit(1);
  }
};

export default connectDB;

import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const string = `${process.env.MONGO_URI}/${DB_NAME}`;
    console.log(`MongoDB connection string: ${string}`);
    await mongoose.connect(string);
    console.log(`Successfully connected to MongoDB 👍`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

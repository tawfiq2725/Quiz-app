import mongoose from "mongoose";

const connectDb = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log("Database already connected");
    return;
  }

  const uri = process.env.MONGO_URL;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in the environment variables.");
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};
export default connectDb;

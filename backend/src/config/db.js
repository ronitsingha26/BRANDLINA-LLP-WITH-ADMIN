import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  return mongoose.connection;
}

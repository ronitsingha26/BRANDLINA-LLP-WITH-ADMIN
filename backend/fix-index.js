import mongoose from "mongoose";

async function run() {
  await mongoose.connect("mongodb://127.0.0.1:27017/brandlina-cms");
  try {
    await mongoose.connection.collection("attendances").dropIndex("user_1_date_1");
    console.log("Successfully dropped legacy index user_1_date_1");
  } catch(e) {
    console.log("Error or already dropped:", e.message);
  }
  process.exit(0);
}
run();

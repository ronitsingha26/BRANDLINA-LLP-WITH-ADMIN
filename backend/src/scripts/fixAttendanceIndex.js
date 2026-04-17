/**
 * One-time fix: drops the stale {user, date} unique index that was leftover 
 * from an old schema, and deletes any corrupt null-employee attendance records.
 * Run: node --experimental-vm-modules src/scripts/fixAttendanceIndex.js
 *   OR via npm: added as a script below.
 */
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/brandlina-cms";

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB:", MONGODB_URI);

  const db = mongoose.connection.db;
  const collection = db.collection("attendances");

  // 1. List all indexes
  const indexes = await collection.indexes();
  console.log("\nExisting indexes:");
  indexes.forEach((idx) => console.log(" -", idx.name, "→", JSON.stringify(idx.key)));

  // 2. Drop any stale indexes that reference old 'user' or 'date' fields
  for (const idx of indexes) {
    const keys = Object.keys(idx.key);
    if (keys.includes("user") || keys.includes("date")) {
      console.log(`\nDropping stale index: ${idx.name}`);
      await collection.dropIndex(idx.name);
      console.log(`✅ Dropped: ${idx.name}`);
    }
  }

  // 3. Delete any corrupt attendance records where employee is null
  const deleted = await collection.deleteMany({ employee: null });
  console.log(`\nDeleted ${deleted.deletedCount} corrupt null-employee attendance record(s).`);

  // 4. Show remaining indexes
  const remaining = await collection.indexes();
  console.log("\nRemaining indexes after cleanup:");
  remaining.forEach((idx) => console.log(" -", idx.name, "→", JSON.stringify(idx.key)));

  await mongoose.disconnect();
  console.log("\n✅ Done! Attendance index fix complete.");
}

run().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});

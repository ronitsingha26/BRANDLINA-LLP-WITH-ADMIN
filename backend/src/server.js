import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { bootstrapDefaults } from "./config/bootstrap.js";

dotenv.config();

const PORT = Number(process.env.PORT || 5001);

async function start() {
  try {
    await connectDB(process.env.MONGODB_URI);
    await bootstrapDefaults();

    app.listen(PORT, () => {
      console.log(`CMS server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

start();

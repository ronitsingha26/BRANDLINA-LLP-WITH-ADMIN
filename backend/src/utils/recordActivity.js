import Activity from "../models/Activity.js";

export async function recordActivity({ action, module, message, resourceId = "" }) {
  try {
    await Activity.create({ action, module, message, resourceId });
  } catch (error) {
    console.error("Failed to write activity", error.message);
  }
}

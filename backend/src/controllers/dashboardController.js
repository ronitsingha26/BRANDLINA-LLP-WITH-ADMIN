import Activity from "../models/Activity.js";
import Contact from "../models/Contact.js";
import Project from "../models/Project.js";
import Service from "../models/Service.js";
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import Leave from "../models/Leave.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const APP_TIMEZONE = process.env.APP_TIMEZONE || "Asia/Kolkata";

const dayKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: APP_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const todayKey = dayKeyFormatter.format(new Date());

  const [
    totalProjects,
    totalServices,
    totalContacts,
    totalEmployees,
    activeEmployees,
    presentToday,
    pendingLeaves,
    recentActivity,
  ] = await Promise.all([
    Project.countDocuments(),
    Service.countDocuments(),
    Contact.countDocuments(),
    Employee.countDocuments(),
    Employee.countDocuments({ isActive: true }),
    Attendance.countDocuments({ dayKey: todayKey }),
    Leave.countDocuments({ status: "pending" }),
    Activity.find().sort({ createdAt: -1 }).limit(10),
  ]);

  res.json({
    totalProjects,
    totalServices,
    totalContacts,
    totalEmployees,
    activeEmployees,
    presentToday,
    pendingLeaves,
    recentActivity,
  });
});

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

function getDayKey(value = new Date()) {
  return dayKeyFormatter.format(value);
}

function toHours(totalMinutes) {
  return Number((Number(totalMinutes || 0) / 60).toFixed(2));
}

export const getEmployeeDashboard = asyncHandler(async (req, res) => {
  const employeeId = req.employee._id;
  const todayKey = getDayKey();

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [todayAttendance, monthAttendance, leaveCounts] = await Promise.all([
    Attendance.findOne({ employee: employeeId, dayKey: todayKey }),
    Attendance.find({ employee: employeeId, checkInAt: { $gte: monthStart } }),
    Leave.aggregate([
      { $match: { employee: employeeId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  const leaveSummary = {
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  for (const row of leaveCounts) {
    if (row?._id && Object.prototype.hasOwnProperty.call(leaveSummary, row._id)) {
      leaveSummary[row._id] = row.count;
    }
  }

  res.json({
    profile: {
      employeeCode: req.employee.employeeCode,
      fullName: req.employee.fullName,
      department: req.employee.department,
      designation: req.employee.designation,
    },
    today: {
      dayKey: todayKey,
      checkInAt: todayAttendance?.checkInAt || null,
      checkOutAt: todayAttendance?.checkOutAt || null,
      totalHours: toHours(todayAttendance?.totalMinutes || 0),
    },
    monthAttendance: {
      totalDays: monthAttendance.length,
      completedDays: monthAttendance.filter((item) => Boolean(item.checkOutAt)).length,
      totalHours: toHours(monthAttendance.reduce((sum, item) => sum + Number(item.totalMinutes || 0), 0)),
    },
    leaves: leaveSummary,
  });
});

import xlsx from "xlsx";
import Attendance from "../models/Attendance.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recordActivity } from "../utils/recordActivity.js";

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

function isValidDayKey(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toHours(totalMinutes) {
  return Number((Number(totalMinutes || 0) / 60).toFixed(2));
}

function mapAttendance(item) {
  return {
    _id: item._id,
    dayKey: item.dayKey,
    checkInAt: item.checkInAt,
    checkOutAt: item.checkOutAt,
    totalMinutes: item.totalMinutes,
    totalHours: toHours(item.totalMinutes),
    source: item.source,
    notes: item.notes,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    employee: item.employee
      ? {
          _id: item.employee._id,
          employeeCode: item.employee.employeeCode,
          fullName: item.employee.fullName,
          department: item.employee.department,
          designation: item.employee.designation,
          isActive: item.employee.isActive,
        }
      : null,
  };
}

function buildDateFilter(from, to) {
  const dayFilter = {};

  if (from && isValidDayKey(from)) {
    dayFilter.$gte = from;
  }

  if (to && isValidDayKey(to)) {
    dayFilter.$lte = to;
  }

  if (!Object.keys(dayFilter).length) {
    return undefined;
  }

  return dayFilter;
}

async function getAdminAttendanceRecords(query) {
  const from = String(query.from || "").trim();
  const to = String(query.to || "").trim();
  const employeeId = String(query.employeeId || "").trim();
  const department = String(query.department || "").trim().toLowerCase();
  const search = String(query.search || "").trim().toLowerCase();

  const filter = {};
  const dayFilter = buildDateFilter(from, to);

  if (dayFilter) {
    filter.dayKey = dayFilter;
  }

  if (employeeId) {
    filter.employee = employeeId;
  }

  const items = await Attendance.find(filter)
    .sort({ dayKey: -1, checkInAt: -1 })
    .populate("employee", "employeeCode fullName department designation isActive");

  return items.filter((item) => {
    if (!item.employee) {
      return false;
    }

    if (department && item.employee.department?.toLowerCase() !== department) {
      return false;
    }

    if (!search) {
      return true;
    }

    const corpus = [
      item.employee.employeeCode,
      item.employee.fullName,
      item.employee.department,
      item.employee.designation,
      item.dayKey,
    ]
      .join(" ")
      .toLowerCase();

    return corpus.includes(search);
  });
}

export const checkIn = asyncHandler(async (req, res) => {
  const dayKey = getDayKey();

  const existing = await Attendance.findOne({
    employee: req.employee._id,
    dayKey,
  });

  if (existing) {
    res.status(400).json({ message: "Check-in already recorded for today" });
    return;
  }

  const item = await Attendance.create({
    employee: req.employee._id,
    dayKey,
    checkInAt: new Date(),
    source: "employee",
  });

  await recordActivity({
    action: "create",
    module: "attendance",
    message: `${req.employee.fullName} checked in`,
    resourceId: item._id.toString(),
  });

  res.status(201).json(mapAttendance(item));
});

export const checkOut = asyncHandler(async (req, res) => {
  const dayKey = getDayKey();

  const item = await Attendance.findOne({
    employee: req.employee._id,
    dayKey,
  });

  if (!item) {
    res.status(400).json({ message: "No check-in found for today" });
    return;
  }

  if (item.checkOutAt) {
    res.status(400).json({ message: "Check-out already recorded for today" });
    return;
  }

  item.checkOutAt = new Date();
  item.totalMinutes = Math.max(1, Math.round((item.checkOutAt.getTime() - item.checkInAt.getTime()) / 60000));
  await item.save();

  await recordActivity({
    action: "update",
    module: "attendance",
    message: `${req.employee.fullName} checked out`,
    resourceId: item._id.toString(),
  });

  res.json(mapAttendance(item));
});

export const getMyAttendance = asyncHandler(async (req, res) => {
  const from = String(req.query.from || "").trim();
  const to = String(req.query.to || "").trim();

  const filter = {
    employee: req.employee._id,
  };

  const dayFilter = buildDateFilter(from, to);
  if (dayFilter) {
    filter.dayKey = dayFilter;
  }

  const items = await Attendance.find(filter).sort({ dayKey: -1, checkInAt: -1 });

  const summary = {
    totalRecords: items.length,
    completedRecords: items.filter((item) => Boolean(item.checkOutAt)).length,
    totalHours: toHours(items.reduce((sum, item) => sum + Number(item.totalMinutes || 0), 0)),
  };

  res.json({ records: items.map(mapAttendance), summary });
});

export const getAttendance = asyncHandler(async (req, res) => {
  const items = await getAdminAttendanceRecords(req.query);

  const summary = {
    totalRecords: items.length,
    completedRecords: items.filter((item) => Boolean(item.checkOutAt)).length,
    totalHours: toHours(items.reduce((sum, item) => sum + Number(item.totalMinutes || 0), 0)),
  };

  res.json({ records: items.map(mapAttendance), summary });
});

export const exportAttendance = asyncHandler(async (req, res) => {
  const items = await getAdminAttendanceRecords(req.query);

  const rows = items.map((item) => ({
    Date: item.dayKey,
    "Employee Code": item.employee?.employeeCode || "",
    "Employee Name": item.employee?.fullName || "",
    Department: item.employee?.department || "",
    Designation: item.employee?.designation || "",
    "Check In": item.checkInAt ? new Date(item.checkInAt).toLocaleString("en-IN") : "",
    "Check Out": item.checkOutAt ? new Date(item.checkOutAt).toLocaleString("en-IN") : "",
    "Worked Hours": toHours(item.totalMinutes),
    Status: item.checkOutAt ? "Completed" : "Checked-in",
  }));

  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(rows);
  xlsx.utils.book_append_sheet(workbook, worksheet, "Attendance");

  const buffer = xlsx.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  const stamp = new Date().toISOString().slice(0, 10);

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename="attendance-${stamp}.xlsx"`);
  res.send(buffer);
});

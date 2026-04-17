import Leave from "../models/Leave.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recordActivity } from "../utils/recordActivity.js";

function startOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfDay(value) {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
}

function mapLeave(item) {
  return {
    _id: item._id,
    leaveType: item.leaveType,
    startDate: item.startDate,
    endDate: item.endDate,
    totalDays: item.totalDays,
    reason: item.reason,
    status: item.status,
    reviewNote: item.reviewNote,
    reviewedAt: item.reviewedAt,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    employee: item.employee
      ? {
          _id: item.employee._id,
          employeeCode: item.employee.employeeCode,
          fullName: item.employee.fullName,
          department: item.employee.department,
          designation: item.employee.designation,
        }
      : null,
    reviewedBy: item.reviewedBy
      ? {
          _id: item.reviewedBy._id,
          username: item.reviewedBy.username,
          displayName: item.reviewedBy.displayName,
        }
      : null,
  };
}

function calculateLeaveDays(from, to) {
  const diff = endOfDay(to).getTime() - startOfDay(from).getTime();
  return Math.floor(diff / 86400000) + 1;
}

export const applyLeave = asyncHandler(async (req, res) => {
  const leaveType = String(req.body.leaveType || "casual").trim().toLowerCase();
  const reason = String(req.body.reason || "").trim();
  const startDateValue = req.body.startDate;
  const endDateValue = req.body.endDate;

  if (!startDateValue || !endDateValue || !reason) {
    res.status(400).json({ message: "Start date, end date and reason are required" });
    return;
  }

  const startDate = startOfDay(startDateValue);
  const endDate = endOfDay(endDateValue);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    res.status(400).json({ message: "Leave dates are invalid" });
    return;
  }

  if (startDate.getTime() > endDate.getTime()) {
    res.status(400).json({ message: "Start date cannot be after end date" });
    return;
  }

  const overlap = await Leave.findOne({
    employee: req.employee._id,
    status: { $in: ["pending", "approved"] },
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  });

  if (overlap) {
    res.status(400).json({ message: "An overlapping leave request already exists" });
    return;
  }

  const item = await Leave.create({
    employee: req.employee._id,
    leaveType: ["casual", "sick", "earned", "unpaid"].includes(leaveType) ? leaveType : "casual",
    startDate,
    endDate,
    totalDays: calculateLeaveDays(startDate, endDate),
    reason,
    status: "pending",
  });

  await recordActivity({
    action: "create",
    module: "leaves",
    message: `${req.employee.fullName} applied for leave`,
    resourceId: item._id.toString(),
  });

  const populated = await item.populate("employee", "employeeCode fullName department designation");
  res.status(201).json(mapLeave(populated));
});

export const getMyLeaves = asyncHandler(async (req, res) => {
  const items = await Leave.find({ employee: req.employee._id }).sort({ createdAt: -1 });
  res.json(items.map(mapLeave));
});

export const getLeaveRequests = asyncHandler(async (req, res) => {
  const status = String(req.query.status || "all").trim().toLowerCase();
  const search = String(req.query.search || "").trim().toLowerCase();

  const filter = {};

  if (["pending", "approved", "rejected"].includes(status)) {
    filter.status = status;
  }

  const items = await Leave.find(filter)
    .sort({ createdAt: -1 })
    .populate("employee", "employeeCode fullName department designation")
    .populate("reviewedBy", "username displayName");

  const filtered = items.filter((item) => {
    if (!search) {
      return true;
    }

    const corpus = [
      item.employee?.employeeCode,
      item.employee?.fullName,
      item.employee?.department,
      item.reason,
      item.leaveType,
      item.status,
    ]
      .join(" ")
      .toLowerCase();

    return corpus.includes(search);
  });

  const counts = {
    pending: filtered.filter((item) => item.status === "pending").length,
    approved: filtered.filter((item) => item.status === "approved").length,
    rejected: filtered.filter((item) => item.status === "rejected").length,
  };

  res.json({ leaves: filtered.map(mapLeave), counts });
});

export const reviewLeaveRequest = asyncHandler(async (req, res) => {
  const status = String(req.body.status || "").trim().toLowerCase();
  const reviewNote = String(req.body.reviewNote || "").trim();

  if (!["approved", "rejected"].includes(status)) {
    res.status(400).json({ message: "Status must be approved or rejected" });
    return;
  }

  const item = await Leave.findById(req.params.id);

  if (!item) {
    res.status(404).json({ message: "Leave request not found" });
    return;
  }

  item.status = status;
  item.reviewNote = reviewNote;
  item.reviewedAt = new Date();
  item.reviewedBy = req.admin._id;

  await item.save();

  await recordActivity({
    action: "update",
    module: "leaves",
    message: `${status === "approved" ? "Approved" : "Rejected"} leave request`,
    resourceId: item._id.toString(),
  });

  await item.populate("employee", "employeeCode fullName department designation");
  await item.populate("reviewedBy", "username displayName");
  const populated = item;

  res.json(mapLeave(populated));
});

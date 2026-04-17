import bcrypt from "bcryptjs";
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recordActivity } from "../utils/recordActivity.js";

function mapEmployee(item) {
  return {
    _id: item._id,
    employeeCode: item.employeeCode,
    fullName: item.fullName,
    email: item.email,
    phone: item.phone,
    department: item.department,
    designation: item.designation,
    joiningDate: item.joiningDate,
    employmentType: item.employmentType,
    isActive: item.isActive,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function normalizeCode(value) {
  return String(value || "").trim().toUpperCase();
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

export const getEmployees = asyncHandler(async (req, res) => {
  const search = String(req.query.search || "").trim();
  const status = String(req.query.status || "all").trim().toLowerCase();

  const filter = {};

  if (status === "active") {
    filter.isActive = true;
  }

  if (status === "inactive") {
    filter.isActive = false;
  }

  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [
      { employeeCode: regex },
      { fullName: regex },
      { email: regex },
      { department: regex },
      { designation: regex },
    ];
  }

  const items = await Employee.find(filter).sort({ createdAt: -1 });
  res.json(items.map(mapEmployee));
});

export const getEmployeeById = asyncHandler(async (req, res) => {
  const item = await Employee.findById(req.params.id);

  if (!item) {
    res.status(404).json({ message: "Employee not found" });
    return;
  }

  res.json(mapEmployee(item));
});

export const createEmployee = asyncHandler(async (req, res) => {
  const employeeCode = normalizeCode(req.body.employeeCode);
  const fullName = String(req.body.fullName || "").trim();
  const email = normalizeEmail(req.body.email);
  const phone = String(req.body.phone || "").trim();
  const department = String(req.body.department || "").trim();
  const designation = String(req.body.designation || "").trim();
  const joiningDateRaw = req.body.joiningDate;
  const employmentType = String(req.body.employmentType || "full-time").trim();
  const password = String(req.body.password || "");

  if (!employeeCode || !fullName || !email || !department || !designation || !joiningDateRaw || !password) {
    res.status(400).json({ message: "Employee code, name, email, department, designation, joining date and password are required" });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters" });
    return;
  }

  const joiningDate = new Date(joiningDateRaw);

  if (Number.isNaN(joiningDate.getTime())) {
    res.status(400).json({ message: "Joining date is invalid" });
    return;
  }

  const existing = await Employee.findOne({
    $or: [{ employeeCode }, { email }],
  });

  if (existing) {
    res.status(400).json({ message: "Employee code or email already exists" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const item = await Employee.create({
    employeeCode,
    fullName,
    email,
    phone,
    department,
    designation,
    joiningDate,
    employmentType,
    passwordHash,
    isActive: true,
  });

  await recordActivity({
    action: "create",
    module: "employees",
    message: `Added employee ${item.fullName} (${item.employeeCode})`,
    resourceId: item._id.toString(),
  });

  res.status(201).json(mapEmployee(item));
});

export const updateEmployee = asyncHandler(async (req, res) => {
  const item = await Employee.findById(req.params.id);

  if (!item) {
    res.status(404).json({ message: "Employee not found" });
    return;
  }

  const employeeCode = req.body.employeeCode !== undefined ? normalizeCode(req.body.employeeCode) : item.employeeCode;
  const email = req.body.email !== undefined ? normalizeEmail(req.body.email) : item.email;

  if (!employeeCode || !email) {
    res.status(400).json({ message: "Employee code and email cannot be empty" });
    return;
  }

  const duplicateCode = await Employee.findOne({ employeeCode, _id: { $ne: item._id } });
  if (duplicateCode) {
    res.status(400).json({ message: "Employee code already exists" });
    return;
  }

  const duplicateEmail = await Employee.findOne({ email, _id: { $ne: item._id } });
  if (duplicateEmail) {
    res.status(400).json({ message: "Employee email already exists" });
    return;
  }

  item.employeeCode = employeeCode;
  item.fullName = req.body.fullName !== undefined ? String(req.body.fullName || "").trim() : item.fullName;
  item.email = email;
  item.phone = req.body.phone !== undefined ? String(req.body.phone || "").trim() : item.phone;
  item.department = req.body.department !== undefined ? String(req.body.department || "").trim() : item.department;
  item.designation = req.body.designation !== undefined ? String(req.body.designation || "").trim() : item.designation;
  item.employmentType = req.body.employmentType !== undefined ? String(req.body.employmentType || "").trim() : item.employmentType;

  if (req.body.joiningDate !== undefined) {
    const joiningDate = new Date(req.body.joiningDate);

    if (Number.isNaN(joiningDate.getTime())) {
      res.status(400).json({ message: "Joining date is invalid" });
      return;
    }

    item.joiningDate = joiningDate;
  }

  if (req.body.password) {
    const nextPassword = String(req.body.password || "");

    if (nextPassword.length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters" });
      return;
    }

    item.passwordHash = await bcrypt.hash(nextPassword, 10);
  }

  await item.save();

  await recordActivity({
    action: "update",
    module: "employees",
    message: `Updated employee ${item.fullName} (${item.employeeCode})`,
    resourceId: item._id.toString(),
  });

  res.json(mapEmployee(item));
});

export const updateEmployeeStatus = asyncHandler(async (req, res) => {
  const item = await Employee.findById(req.params.id);

  if (!item) {
    res.status(404).json({ message: "Employee not found" });
    return;
  }

  const nextStatus = typeof req.body.isActive === "boolean" ? req.body.isActive : !item.isActive;
  item.isActive = nextStatus;
  await item.save();

  await recordActivity({
    action: "update",
    module: "employees",
    message: `${nextStatus ? "Activated" : "Deactivated"} employee ${item.fullName}`,
    resourceId: item._id.toString(),
  });

  res.json(mapEmployee(item));
});

export const deleteEmployee = asyncHandler(async (req, res) => {
  const item = await Employee.findById(req.params.id);

  if (!item) {
    res.status(404).json({ message: "Employee not found" });
    return;
  }

  await Promise.all([
    Attendance.deleteMany({ employee: item._id }),
    Leave.deleteMany({ employee: item._id }),
    Employee.deleteOne({ _id: item._id }),
  ]);

  await recordActivity({
    action: "delete",
    module: "employees",
    message: `Deleted employee ${item.fullName} (${item.employeeCode})`,
    resourceId: item._id.toString(),
  });

  res.json({ message: "Employee deleted" });
});

import bcrypt from "bcryptjs";
import AdminCredential from "../models/AdminCredential.js";
import Employee from "../models/Employee.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signAuthToken } from "../utils/authTokens.js";

function mapAdmin(admin) {
  return {
    id: admin._id,
    role: "admin",
    username: admin.username,
    displayName: admin.displayName,
    email: admin.email,
  };
}

function mapEmployee(employee) {
  return {
    id: employee._id,
    role: "employee",
    employeeCode: employee.employeeCode,
    fullName: employee.fullName,
    email: employee.email,
    department: employee.department,
    designation: employee.designation,
  };
}

export const loginAdmin = asyncHandler(async (req, res) => {
  const username = String(req.body.username || "").trim().toLowerCase();
  const password = String(req.body.password || "").trim();

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  const admin = await AdminCredential.findOne({
    $or: [{ username }, { email: username }],
  });

  if (!admin || !admin.isActive) {
    res.status(401).json({ message: "Invalid admin credentials" });
    return;
  }

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);

  if (!passwordMatches) {
    res.status(401).json({ message: "Invalid admin credentials" });
    return;
  }

  const token = signAuthToken({
    userId: admin._id.toString(),
    role: "admin",
    name: admin.displayName || admin.username,
  });

  res.json({ token, user: mapAdmin(admin) });
});

export const loginEmployee = asyncHandler(async (req, res) => {
  const identifier = String(req.body.identifier || req.body.employeeCode || req.body.email || "").trim();
  const password = String(req.body.password || "").trim();

  if (!identifier || !password) {
    res.status(400).json({ message: "Employee code/email and password are required" });
    return;
  }

  const employee = await Employee.findOne({
    $or: [
      { employeeCode: identifier.toUpperCase() },
      { email: identifier.toLowerCase() },
    ],
  });

  if (!employee || !employee.isActive) {
    res.status(401).json({ message: "Invalid employee credentials" });
    return;
  }

  const passwordMatches = await bcrypt.compare(password, employee.passwordHash);

  if (!passwordMatches) {
    res.status(401).json({ message: "Invalid employee credentials" });
    return;
  }

  const token = signAuthToken({
    userId: employee._id.toString(),
    role: "employee",
    name: employee.fullName,
  });

  res.json({ token, user: mapEmployee(employee) });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  if (req.auth?.role === "admin" && req.admin) {
    res.json({ user: mapAdmin(req.admin) });
    return;
  }

  if (req.auth?.role === "employee" && req.employee) {
    res.json({ user: mapEmployee(req.employee) });
    return;
  }

  res.status(401).json({ message: "Session not found" });
});

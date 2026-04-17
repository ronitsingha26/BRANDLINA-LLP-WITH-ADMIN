import AdminCredential from "../models/AdminCredential.js";
import Employee from "../models/Employee.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAuthToken } from "../utils/authTokens.js";

function getBearerToken(req) {
  const value = req.headers.authorization || "";
  if (!value.startsWith("Bearer ")) {
    return "";
  }
  return value.slice(7).trim();
}

export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = getBearerToken(req);

  if (!token) {
    res.status(401).json({ message: "Authentication token is required" });
    return;
  }

  let payload;

  try {
    payload = verifyAuthToken(token);
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  if (!payload?.sub || !payload?.role) {
    res.status(401).json({ message: "Invalid authentication payload" });
    return;
  }

  if (payload.role === "admin") {
    const admin = await AdminCredential.findById(payload.sub);

    if (!admin || !admin.isActive) {
      res.status(401).json({ message: "Admin account is inactive" });
      return;
    }

    req.auth = {
      userId: admin._id.toString(),
      role: "admin",
      name: admin.displayName || admin.username,
    };
    req.admin = admin;

    next();
    return;
  }

  if (payload.role === "employee") {
    const employee = await Employee.findById(payload.sub);

    if (!employee || !employee.isActive) {
      res.status(401).json({ message: "Employee account is inactive" });
      return;
    }

    req.auth = {
      userId: employee._id.toString(),
      role: "employee",
      name: employee.fullName,
    };
    req.employee = employee;

    next();
    return;
  }

  res.status(401).json({ message: "Unsupported auth role" });
});

export function requireAdmin(req, res, next) {
  if (req.auth?.role !== "admin") {
    res.status(403).json({ message: "Admin access is required" });
    return;
  }

  next();
}

export function requireEmployee(req, res, next) {
  if (req.auth?.role !== "employee") {
    res.status(403).json({ message: "Employee access is required" });
    return;
  }

  next();
}

export const requireAdminAuth = [requireAuth, requireAdmin];
export const requireEmployeeAuth = [requireAuth, requireEmployee];

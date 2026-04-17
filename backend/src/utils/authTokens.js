import jwt from "jsonwebtoken";

const FALLBACK_SECRET = "brandlina-dev-jwt-secret";

function getJwtSecret() {
  return process.env.JWT_SECRET || FALLBACK_SECRET;
}

export function signAuthToken({ userId, role, name = "" }) {
  const expiresIn = role === "admin" ? process.env.ADMIN_TOKEN_EXPIRES_IN || "1d" : process.env.EMPLOYEE_TOKEN_EXPIRES_IN || "12h";

  return jwt.sign(
    {
      sub: userId,
      role,
      name,
    },
    getJwtSecret(),
    { expiresIn },
  );
}

export function verifyAuthToken(token) {
  return jwt.verify(token, getJwtSecret());
}

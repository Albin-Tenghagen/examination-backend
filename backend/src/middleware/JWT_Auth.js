// src/middleware/jwtAuth.js
import jwt from "jsonwebtoken";
import { pool } from "../../db/db.js"; // your Postgres pool

export async function jwtAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Token missing or bad format" });
  }
  const token = parts[1];

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({ error: "JWT_SECRET not configured" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (typeof decoded === "string") {
      return res.status(403).json({ error: "Invalid token format" });
    }

    const { userId, email } = decoded;
    if (!userId || !email) {
      return res.status(403).json({ error: "Token missing required claims" });
    }

    req.user = {
      id: userId,
      email: email,
    };

    return next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export default jwtAuth;

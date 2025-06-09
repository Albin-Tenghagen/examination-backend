// src/middleware/authenticateToken.js
import jwt from "jsonwebtoken";
import { pool } from "../../db/db.js"; // your Postgres pool

/**
 * Protects routes by verifying the access token (signed with JWT_SECRET).
 * Expects the token payload to have { userId, email }.
 * If valid, attaches req.user = { id: userId, email } and calls next().
 */
export async function authenticateToken(req, res, next) {
  // 1) Grab the Authorization header
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  // 2) Expect format "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Token missing or bad format" });
  }
  const token = parts[1];

  // 3) Ensure JWT_SECRET is set
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({ error: "JWT_SECRET not configured" });
  }

  try {
    // 4) Verify token
    const decoded = jwt.verify(token, jwtSecret);
    // At this point, decoded should be an object, not a string.
    if (typeof decoded === "string") {
      return res.status(403).json({ error: "Invalid token format" });
    }

    // 5) Extract userId/email from the payload
    const { userId, email } = decoded;
    if (!userId || !email) {
      return res.status(403).json({ error: "Token missing required claims" });
    }

    // 6) OPTIONAL: Double‐check that this user ID still exists in your users table.
    //    This guards against e.g. a user being deleted after their token was issued.
    // const result = await pool.query(
    //   "SELECT 1 FROM users WHERE id = $1 AND email = $2",
    //   [userId, email]
    // );
    // if (result.rowCount === 0) {
    //   return res.status(401).json({ error: "User not found or unauthorized" });
    // }

    // 7) Attach to req.user for downstream handlers
    req.user = {
      id: userId,
      email: email,
    };

    // 8) All good → continue
    return next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export default authenticateToken;

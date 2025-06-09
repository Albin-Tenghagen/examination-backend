import jwt from "jsonwebtoken";

export async function generateToken(req, res) {
  const user = req.user;
  if (!user || !user.id || !user.email) {
    return res.status(400).json({ error: "No user data to sign token." });
  }
  try {
    const jwtSecret = process.env.JWT_SECRET;
    const refreshSecret = process.env.REFRESH_SECRET;

    if (!jwtSecret || !refreshSecret) {
      res
        .status(500)
        .json({ error: "JWT_SECRET or REFRESH_SECRET not defined" });
      return;
    }

    const payload = { userId: user.id, email: user.email };

    const accessToken = jwt.sign(payload, jwtSecret, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(payload, refreshSecret, {
      expiresIn: "7d",
    });

    res.setHeader("Authorization", `Bearer ${accessToken}`);

    res.locals.token = accessToken;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Tokens generated successfully",
      accessToken,
    });
  } catch (err) {
    console.error("Error querying admins table:", err);

    res.status(500).json({ error: "Failed to generate token" });
    return;
  }
}

export default generateToken;

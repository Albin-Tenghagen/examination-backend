import express from "express";
import bcrypt from "bcrypt";
import { pool } from "../../db/db.js";
import generateToken from "../middleware/JWTgeneration.js";

const userRouter = express.Router();

userRouter.get("/users", async (req, res) => {
  return res.status(200).json({ message: "default route for the user portal" });
});

// POST(signup)
userRouter.post("/users/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "There are missing credentials, Email or password is missing.",
    });
  }

  const smallEmail = email.trim().toLowerCase();
  try {
    const checkIfExisting = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [smallEmail]
    );

    if (checkIfExisting.rowCount > 0) {
      return res.status(409).json({
        message:
          "The email you entered is already registered, proceed to the login page",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertResult = await pool.query(
      `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email`,
      [smallEmail, hashedPassword]
    );

    const newUser = insertResult.rows[0];

    req.user = {
      id: newUser.id,
      email: newUser.email,
    };

    return generateToken(req, res);
  } catch (error) {
    console.error("There was an error while registering, try again", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//POST(LOGIN)

userRouter.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "There are missing credentials, Email or password is missing.",
    });
  }
  const smallEmail = email.trim().toLowerCase();
  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      smallEmail,
    ]);

    const user = result.rows[0];

    if (!user) {
      return res
        .status(404)
        .json({ message: "Unable to login, The email is not registered " });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res
        .status(401)
        .json({ message: "Password does not match, try again" });
    }

    req.user = {
      id: user.id,
      email: user.email,
    };

    return generateToken(req, res);
  } catch (error) {
    console.error("There was an error while registering, try again", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
export default userRouter;

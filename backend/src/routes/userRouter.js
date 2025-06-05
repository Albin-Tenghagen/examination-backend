import express from "express";
// import db from "../../db/db";

const userRouter = express.Router();

userRouter.use("/user", async (req, res) => {
  return res.status(200).json({ message: "default route for the user portal" });
});

// POST(REGISTER)

//POST(LOGIN)
export default userRouter;

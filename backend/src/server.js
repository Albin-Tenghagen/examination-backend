import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
//Middleware
import { swaggerUi, swaggerDocs } from "./middleware/swagger.js";
import { testConnection } from "../db/db.js";
// routes
import notesRouter from "./routes/notesRouter.js";
import userRouter from "./routes/userRouter.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

testConnection();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api", notesRouter);
app.use("/api", userRouter);
app.get("/api", async (req, res) => {
  return res
    .status(200)
    .json({ message: "This is the default route for the api" });
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

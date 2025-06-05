import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  return res
    .status(200)
    .json({ message: "This is the default route for the api" });
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

import express from "express";
// import db from "../../db/db";

const notesRouter = express.Router();

notesRouter.use("/notes", async (req, res) => {
  return res.status(200).json({ message: "default route for the notes" });
});

//GET

// SEARCH(GET)

//POST

//PUT

//DELETE

export default notesRouter;

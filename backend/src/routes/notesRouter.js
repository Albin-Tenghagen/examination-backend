import express from "express";
import { pool } from "../../db/db.js";
import jwtAuth from "../middleware/JWT_Auth.js";
import { timestampCreation } from "../middleware/timestampCreation.js";
const notesRouter = express.Router();

//GET
notesRouter.get("/notes", jwtAuth, async (req, res) => {
  const { id } = req.user;
  console.log("Fetching notes for user ID:", id);

  try {
    const allNotes = await pool.query(
      `SELECT user_id, title, text, created_at, modified_at FROM notes WHERE user_id = $1`,
      [id]
    );

    if (allNotes.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "No notes were found. Create one first!" });
    }

    return res.status(200).json({
      message: "These notes were found on your account:",
      notes: allNotes.rows,
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// SEARCH(GET)
notesRouter.get("/notes/search", jwtAuth, async (req, res) => {
  const { id } = req.user;
  const { title } = req.query;

  if (!title) {
    return res.status(401).json({ message: "No search term was provided." });
  }

  try {
    const result = await pool.query(
      `SELECT user_id, title, text, created_at, modified_at FROM notes WHERE user_id = $1 AND title ILIKE $2`,
      [id, `%${title}%`]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No matching notes found." });
    }

    res.status(200).json({
      message: "Found the following notes:",
      notes: result.rows,
    });
  } catch (error) {
    console.error("Error fetching specific note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//POST
notesRouter.post("/notes", jwtAuth, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authorization failed" });
  }
  const { id } = req.user;
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(401).json({ message: "Title or text is missing." });
  }

  try {
    const created_at = timestampCreation();
    const modified_at = created_at;

    const result = await pool.query(
      `INSERT INTO notes (user_id, title, text, created_at, modified_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, title, text, created_at, modified_at]
    );

    res.status(201).json({
      message: "Note created successfully",
      note: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//PUT
notesRouter.put("/notes/:id", jwtAuth, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authorization failed" });
  }

  const userId = req.user.id;
  const noteId = parseInt(req.params.id);
  const { title, text } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM notes WHERE id = $1 AND user_id = $2`,
      [noteId, userId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "The note you want to edit was not found" });
    }

    const note = result.rows[0];

    const updatedTitle = title || note.title;
    const updatedText = text || note.text;
    const modifiedAt = timestampCreation();

    const updateQuery = await pool.query(
      `UPDATE notes 
       SET title = $1, text = $2, modified_at = $3 
       WHERE id = $4 AND user_id = $5   
       RETURNING *`,
      [updatedTitle, updatedText, modifiedAt, noteId, userId]
    );

    res
      .status(200)
      .json({ message: "Note entry updated", data: updateQuery.rows[0] });
  } catch (error) {
    console.error("There was an error while editing note, try again", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//DELETE
notesRouter.delete("/notes/:id", jwtAuth, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authorization failed" });
  }
  const { id } = req.user;
  const paramId = req.params.id;

  try {
    const result = await pool.query(
      `DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *`,
      [paramId, id]
    );

    if (result.rowCount == 0) {
      return res
        .status(404)
        .json({ message: "Could not delete the note, as it was not found" });
    }

    return res
      .status(200)
      .json({ message: "Note entry deleted", data: result.rows[0] });
  } catch (error) {
    console.error("There was an error while registering, try again", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
export default notesRouter;

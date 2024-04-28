import express from "express";
import { NoteController } from "../controllers/NoteController";

const router = express.Router();

const noteController = new NoteController();

router.get("/note-to-pdf", noteController.downloadPDFByURL);

export default router;

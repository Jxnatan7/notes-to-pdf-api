import { Request, Response } from "express";
import { NoteService } from "../services/NoteService";

class NoteController {

    async downloadPDFByURL(req: Request, res: Response) {
        try {
            const noteService = new NoteService();

            const url = `${req.query.url}`;

            if (!url) {
                return res.status(400).send("The URL was not provided.");
            }

            const base64String = await noteService.downloadPDFByUrl(url);

            res.status(200).json({ pdfBase64: base64String });
        } catch (error) {
            console.error("Error generating PDF:", error);
            res.status(500).send("An error occurred while generating the PDF.");
        }
    }
}

export { NoteController };
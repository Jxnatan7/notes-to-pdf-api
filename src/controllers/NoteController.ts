import { Request, Response } from "express";
import { NoteService } from "../services/NoteService";

class NoteController {

    private noteService = new NoteService();

    async downloadPDFByURL(req: Request, res: Response) {
        try {
            const url = req.query.url as string;

            if (!url) {
                return res.status(400).send("The URL was not provided.");
            }

            const base64String = await this.noteService.downloadPDFByUrl(url);

            res.status(200).json({ pdfBase64: base64String });
        } catch (error) {
            console.error("Error generating PDF:", error);
            res.status(500).send("An error occurred while generating the PDF.");
        }
    }

    async saveMultipleImagesBase64ToJSON(req: Request, res: Response) {
        try {
            const imagesBase64: string[] = req.body;

            if (!imagesBase64) {
                return res.status(400).send("The Images was not provided.");
            }

            await this.noteService.saveMultipleImagesBase64ToJSON(imagesBase64);

            return res.status(200);
        } catch (error) {
            console.error("Error save Images base64:", error);
            res.status(500).send("An error occurred while save images.");
        }
    }
}

export { NoteController };
import express from "express";
import puppeteer from "puppeteer";

const app = express();

app.get("/note-to-pdf", async (req, res) => {
    try {
        const url = req.query.url as string;

        if (!url) {
            return res.status(400).send("The URL was not provided.");
        }

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({ format: "A4" });

        await browser.close();

        res.contentType("application/pdf");
        res.status(200);
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).send("An error occurred while generating the PDF.");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on the port ${PORT}`);
});

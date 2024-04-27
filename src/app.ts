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

        const searchResultSelector = '#heading2';

        await page.waitForSelector(searchResultSelector);

        await page.click(searchResultSelector);

        const pdfBuffer = await page.pdf({ format: "A4" });

        await browser.close();

        const base64String = pdfBuffer.toString('base64');

        res.status(200).json({ pdfBase64: base64String });
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).send("An error occurred while generating the PDF.");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on the port ${PORT}`);
});

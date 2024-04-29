import puppeteer from "puppeteer";

class NoteService {
    async downloadPDFByUrl(url: string) {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

        const page = await browser.newPage();

        await page.goto(url, { waitUntil: "networkidle0" });

        const searchResultSelector = '#heading2';

        await page.waitForSelector(searchResultSelector);

        await page.click(searchResultSelector);

        const pdfBuffer = await page.pdf({ format: "A4" });

        await browser.close();

        const base64String = pdfBuffer.toString('base64');
    }
}

export { NoteService };
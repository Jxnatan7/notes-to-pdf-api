import puppeteer from "puppeteer";
import Jimp from "jimp";
import fs from "fs";
// @ts-ignore
import QrCode from 'qrcode-reader';

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

        return base64String;
    }

    async saveBase64ToJSON(base64: string): Promise<void> {
        try {
            const outputPath = "imagesBase64.json";
            const data = JSON.stringify({ image: base64 });
            fs.writeFileSync(outputPath, data);
        } catch (error) {
            throw new Error(`Error saving base64 to JSON: ${error}`);
        }
    }

    async saveMultipleImagesBase64ToJSON(base64Images: string[]): Promise<void> {
        try {
            const outputPath = "imagesBase64.json";
            const imagesData = base64Images.map((base64, index) => ({ index: index, image: base64 }));
            const jsonData = JSON.stringify(imagesData);
            fs.writeFileSync(outputPath, jsonData);
        } catch (error) {
            throw new Error(`Error saving base64 images to JSON: ${error}`);
        }
    }

    async readQrCodeByBase64(base64: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const qrCodeInstance = new QrCode();
            qrCodeInstance.callback = (err: any, value: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(value.result);
                }
            };
            const imageBuffer = Buffer.from(base64.split(',')[1], 'base64');
            Jimp.read(imageBuffer, (err, image) => {
                if (err) {
                    reject(err);
                } else {
                    qrCodeInstance.decode(image.bitmap);
                }
            });
        });
    }
}

export { NoteService };
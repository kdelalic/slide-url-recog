import express from 'express';
import Busboy from "busboy";
import ocr from "./ocr";

const app = express();
const port = 3000;
const computerVisionClient = ocr.NewComputerVisionClient();

app.post('/ocr', (req: express.Request, res: express.Response) => {
    const busboy = new Busboy({ headers: req.headers });

    // Assuming only one image will be in the payload.
    // Will need to use Promise.all for multiple image support.
    busboy.on('file', (fieldname, file, filename) => {
        ocr.ReadPrintedText(computerVisionClient, () => file)
            .then((result) => {
                if (!result) throw new Error("No result was returned.")
                if (!result.regions) throw new Error("No regions were returned.")

                const urls = ocr.ParseVisionResult(result.regions);

                if (urls.length === 0) {
                    throw new Error("No valid URLs were found.")
                }

                res.send(urls);
            });
    });

    busboy.on('finish', () => {
        // tslint:disable-next-line:no-console
        console.log("Finish")
    });

    return req.pipe(busboy);
})

app.listen(port);
// tslint:disable-next-line:no-console
console.log('Express started on port ' + port);

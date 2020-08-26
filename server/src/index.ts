import express from 'express';
import cors from 'cors';
import multer from 'multer';

import ocr from "./ocr";
import Logger from "./logger";
import { Config } from "./config";

const storage = multer.memoryStorage()
const upload = multer({ storage })

const app = express();
const log = new Logger();

const computerVisionClient = ocr.NewComputerVisionClient();

// Sets CORS options from config file
app.use(cors(Config.CORS_OPTIONS));

app.post('/ocr', upload.single("file"), async (req: express.Request, res: express.Response) => {

  console.log(req);

  if (!req.file || !req.file.buffer) throw new Error("No image file in request.")

  try {
    const result = await ocr.ReadPrintedText(computerVisionClient, req.file.buffer);
    const urls = ocr.ParseVisionResult(result.regions);

    res.send(urls);

    log.debug("Found urls: " + urls);
    log.info("Success");
  } catch (err) {
    log.error(`${err.code}: ${err.message}`);
    res.status(500).send("Error while detecting URLs.");
  }
})

app.listen(Config.PORT, () => {
  log.info(`Express started on port ${Config.PORT}`);
});

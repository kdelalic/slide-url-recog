import { ComputerVisionClient } from "@azure/cognitiveservices-computervision";
import { HttpRequestBody, ApiKeyCredentials } from "@azure/ms-rest-js";

import { Config } from "./config";
import Logger from "./logger";

const log = new Logger();

if (!Config.COMPUTER_VISION_SUBSCRIPTION_KEY) throw new Error('Set your environment variables for your subscription key.');
if (!Config.COMPUTER_VISION_ENDPOINT) throw new Error('Set your environment variables for your subscription endpoint.');

const NewComputerVisionClient = () => {
  const computerVisionClient = new ComputerVisionClient(new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': Config.COMPUTER_VISION_SUBSCRIPTION_KEY } }), Config.COMPUTER_VISION_ENDPOINT!);
  return computerVisionClient;
}

const ReadPrintedText = (client: ComputerVisionClient, imageData: HttpRequestBody) => {
  log.info('Recognizing printed text...');

  return client.recognizePrintedTextInStream(false, imageData);
}

const ParseVisionResult = (regions: any): string[] => {
  const urls = [];

  for (const region of regions) {
    if (!region.lines) continue;

    for (const line of region.lines) {
      if (!line.words) continue;

      for (const word of line.words) {
        if (!word.text) continue;

        if (checkValidURL(word.text)) urls.push(word.text);
      }
    }
  }

  return urls;
}

const checkValidURL = (url: string): boolean => {
  const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  const regex = new RegExp(expression);
  return regex.test(url);
}

export default { NewComputerVisionClient, ParseVisionResult, ReadPrintedText };

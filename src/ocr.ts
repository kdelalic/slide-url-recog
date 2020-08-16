import { ComputerVisionClient } from "@azure/cognitiveservices-computervision";
import { HttpRequestBody, ApiKeyCredentials } from "@azure/ms-rest-js";

const key = process.env.COMPUTER_VISION_SUBSCRIPTION_KEY;
const endpoint = process.env.COMPUTER_VISION_ENDPOINT
if (!key) throw new Error('Set your environment variables for your subscription key.');
if (!endpoint) throw new Error('Set your environment variables for your subscription endpoint.');

const NewComputerVisionClient = () => {
    const computerVisionClient = new ComputerVisionClient(new ApiKeyCredentials({inHeader: {'Ocp-Apim-Subscription-Key': key}}), endpoint!);
    return computerVisionClient;
}

const ReadPrintedText = (client: ComputerVisionClient, imageData: HttpRequestBody) => {
    // tslint:disable-next-line:no-console
    console.log('Recognizing printed text...');

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

    if (urls.length === 0) {
        throw new Error("No valid URLs were found.")
    }

    return urls;
}

const checkValidURL = (url: string): boolean => {
    const expression = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
    const regex = new RegExp(expression);
    return regex.test(url);
}

export default { NewComputerVisionClient, ParseVisionResult, ReadPrintedText };

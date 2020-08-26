export class Config {
  // Production check
  public static DEVELOPMENT_MODE: boolean = process.env.NODE_ENV !== 'production';

  // Highest logger level to use
  public static LOGGER_LEVEL: string = process.env.LOGGER_LEVEL || 'debug';

  // Logger levels to use
  public static LOGGER_LEVELS = { error: 0, warn: 1, info: 2, verbose: 3, debug: 4 };

  // Port which server is hosted on
  public static PORT = process.env.PORT || 8080;

  // CORS options for allowing only access from specific IPs
  public static CORS_OPTIONS = {
    origin: process.env.NODE_ENV === 'production' ? process.env.SERVER_ORIGIN : 'http://localhost:8080',
    optionsSuccessStatus: 200
  };

  // Subscription key for Microsoft Vision API
  public static COMPUTER_VISION_SUBSCRIPTION_KEY = process.env.COMPUTER_VISION_SUBSCRIPTION_KEY;

  // Endpoint for Microsoft Vision API
  public static COMPUTER_VISION_ENDPOINT = process.env.COMPUTER_VISION_ENDPOINT;
}
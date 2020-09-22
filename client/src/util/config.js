// Production check
export const DEVELOPMENT_MODE = process.env.NODE_ENV !== 'production';

export const BASE_SERVER_URL = DEVELOPMENT_MODE
  ? 'http://localhost:8080'
  : process.env.PRODUCTION_SERVER_URL;

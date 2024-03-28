import dotenv from "dotenv";

export const ENV = process.argv.slice(5)[0];

const path = ENV ? "./src/config/prod.env" : "./src/config/dev.env";
// const path = "./src/config/prod.env" || "./src/config/dev.env";

dotenv.config({ path });

export const BASE_URL =
  process.env.PORT == 3000
    ? process.env.DEV_BASE_URL
    : process.env.PROD_BASE_URL;
export const CNX_STR = process.env.CNX_STR;
export const GITHUB_APP_ID = process.env.GITHUB_APP_ID;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
export const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const COOKIE_SECRET = process.env.COOKIE_SECRET;
export const DEFAULT_USER_AVATAR_PATH = process.env.DEFAULT_USER_AVATAR_PATH;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
export const EXECUTION_ENV = process.env.EXECUTION_ENV;
export const USERS_PATH_JSON = process.env.USERS_PATH_JSON;
export const CARTS_PATH_JSON = process.env.CARTS_PATH_JSON;
export const PRODUCTS_PATH_JSON = process.env.PRODUCTS_PATH_JSON;
export const ORDERS_PATH_JSON = process.env.ORDERS_PATH_JSON;
export const PORT = process.env.PORT;

export const NODEMAILER_USER = process.env.NODEMAILER_USER;
export const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD;

export const TESTING_EMAIL = process.env.TESTING_EMAIL;
export const TESTING_PASSWORD = process.env.TESTING_PASSWORD;
export const TESTING_NAME = process.env.TESTING_NAME;
export const TESTING_LASTNAME = process.env.TESTING_LASTNAME;

// Logs on file
// export const loggerLevel = {
//   CONSOLE: EXECUTION_ENV === "prod" ? "error" : "http",
//   FILE: EXECUTION_ENV === "prod" ? "http" : "error",
// };

// Logs on terminal
export const loggerLevel = {
  CONSOLE: EXECUTION_ENV === "prod" ? "http" : "http",
  FILE: EXECUTION_ENV === "prod" ? "http" : "error",
};

export const SWAGGER_CONFIG = {
  definition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "API Documentation",
      description: "API Documentation",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./docs/**/*.yaml"],
};

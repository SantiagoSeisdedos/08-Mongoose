import winston from "winston";
import { loggerLevel } from "../config/config.js";

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: loggerLevel.CONSOLE }),
    new winston.transports.File({
      filename: "./src/logs/error.log",
      level: loggerLevel.FILE,
    }),
  ],
});

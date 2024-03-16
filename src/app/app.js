import "dotenv/config";
import express from "express";
import handlebars from "express-handlebars";
import { Server as SocketIOServer } from "socket.io";

import {
  injectSocketServer,
  onConnection,
} from "../sockets/socket.controller.js";

// middlewares
import {
  authentication,
  passportSession,
} from "../middlewares/authentication.js";
import { sessions } from "../middlewares/sessions.js";
import { cookies } from "../middlewares/cookies.js";
import { httpLogger } from "../middlewares/httpLogger.js";

// routes
import { apiRouter } from "../routes/api/api.router.js";
import { webRouter } from "../routes/web/web.router.js";
import { loggerTestRouter } from "../routes/api/logger.router.js";
import { logger } from "../utils/logger.js";
import { BASE_URL, PORT } from "../config/config.js";

export class ServerAPI {
  #server;

  constructor() {
    this.app = express();

    this.app.use(express.json());
    this.app.use(httpLogger);
    this.app.use(cookies);
    this.app.engine("handlebars", handlebars.engine());
    this.app.use(sessions);
    this.app.use(authentication, passportSession);

    // Socket.io
    this.webSocketServer = new SocketIOServer(this.#server);

    // Websocket server
    this.webSocketServer.on("connection", onConnection(this.webSocketServer));
    this.app.use(injectSocketServer(this.webSocketServer));

    // Public files
    this.app.use(express.static("public"));
    this.app.use(express.static("views"));
    this.app.use(express.static("static"));

    // routers
    this.app.use("/loggerTest", loggerTestRouter);
    this.app.use("/", webRouter);
    this.app.use("/api", apiRouter);
  }
  startServer(port = PORT, baseUrl = BASE_URL) {
    return new Promise((resolve, reject) => {
      this.#server = this.app.listen(port, () => {
        // await connect();
        logger.info(`Server on port ${port}: ${baseUrl}`);
        resolve(this.#server);
      });
    });
  }

  closeServer() {
    return new Promise((resolve, reject) => {
      this.#server.close((err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  }
}

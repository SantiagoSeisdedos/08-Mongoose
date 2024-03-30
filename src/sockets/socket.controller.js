import "dotenv/config";
import axios from "axios";
import { BASE_URL } from "../config/config.js";
import { logger } from "../utils/logger.js";

async function getProducts() {
  return await axios
    .get(`${BASE_URL}/api/products`, { withCredentials: true })
    .then((res) => {
      return res.data;
    })
    .catch((err) => logger.info(err.message));
}

async function deleteProduct(id) {
  return await axios
    .delete(`${BASE_URL}/api/products/${id}`)
    .then((res) => res.data)
    .catch((err) =>
      logger.info("deleteProduct error: ", {
        message: err.message,
        data: err.response.data.error,
        status: err.response.status,
      })
    );
}

async function getMessages() {
  return await axios
    .get(`${BASE_URL}/api/messages`)
    .then((res) => res.data)
    .catch((err) => logger.info("Error on getMessages socket", err));
}

// Delete Message
async function deleteMessage(id) {
  return await axios
    .delete(`${BASE_URL}/api/messages/${id}`)
    .then((res) => res.data)
    .catch((err) => logger.info("Error on deleteMessage socket", err));
}

async function addMessage({ username, text }) {
  logger.info("addMessage socket: ", { username, text });
  return await axios
    .post(`${BASE_URL}/api/messages`, { username, text })
    .then((res) => res.data)
    .catch((err) => logger.info("Error on postMessage socket", err));
}

export function onConnection(socketServer) {
  return async function (socket) {
    // User Conected
    socket.broadcast.emit("new-user", socket.handshake.auth.username);

    // User Disconected
    socket.on("disconnecting", () => {
      socket.broadcast.emit(
        "user-disconnected",
        socket.handshake.auth.username
      );
    });

    // Get products
    socket.emit("getProducts", await getProducts());

    // Delete product
    socket.on("deleteProduct", async (id) => {
      // await deleteProduct(id);
      socket.emit("getProducts", await getProducts());
    });

    // Add product
    socket.on("addProduct", async () => {
      socket.emit("getProducts", await getProducts());
    });

    // Get Chat Messages
    socket.emit("getMessages", await getMessages());

    // Delete Message
    socket.on("deleteMessage", async (id) => {
      await deleteMessage(id);
      socket.emit("getMessages", await getMessages());
    });

    // Add Message to DB
    socket.on("addMessage", async (message) => {
      await addMessage(message);
      socket.emit("getMessages", await getMessages());
    });
  };
}

export function injectSocketServer(socketServer) {
  return function (req, res, next) {
    req.socketServer = socketServer;
    next();
  };
}

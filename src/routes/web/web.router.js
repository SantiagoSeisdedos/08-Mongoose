import "dotenv/config";
import path from "path";
import { Router } from "express";
import axios from "axios";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import { BASE_URL, SWAGGER_CONFIG } from "../../config/config.js";
import { usersRouter } from "./users.router.js";
import { sessionsRouter } from "./sessions.router.js";
import { upload } from "../../middlewares/saveImage.js";
import { logger } from "../../utils/logger.js";
import { usersService } from "../../services/users.service.js";

export const webRouter = Router();

webRouter.get("/", (req, res) => {
  try {
    return res.render("home.handlebars", { pageTitle: "Home" });
  } catch (error) {
    logger.info(error);
    return res.status(500).json({ message: "Error loading home" });
  }
});

webRouter.get("/usersTable", async (req, res) => {
  try {
    const users = await usersService.getUsers();

    return res.render("usersTable.handlebars", {
      pageTitle: "Users Table",
      users,
    });
  } catch (error) {
    logger.info(error);
    return res.status(500).json({ message: "Error loading /usersTable" });
  }
});

webRouter.get("/products", (req, res) => {
  try {
    return res.render("products.handlebars", {
      pageTitle: `Products`,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error loading /products" });
  }
});

webRouter.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) throw new Error("Product ID is required");

    const product = await axios.get(`${BASE_URL}/api/products/${productId}`);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.render("productDetails.handlebars", {
      product: product.data,
      baseUrl: BASE_URL + "/",
      pageTitle: `Producto ${product.title}`,
    });
  } catch (error) {
    logger.info(error);
    return res.status(500).json({ message: "Error loading /products/:id" });
  }
});

webRouter.get("/realTimeProducts", (req, res) => {
  try {
    logger.info("Cliente conectado al realtime!");
    return res.render("realTimeProducts.handlebars", {
      pageTitle: "Real Time Products",
    });
  } catch (error) {
    logger.info(error);
    return res.status(500).json({ message: "Error loading /realTimeProducts" });
  }
});

webRouter.get("/chat", (req, res) => {
  try {
    logger.info("Cliente conectado al chat!");
    return res.render("chat.handlebars", { pageTitle: "Chat" });
  } catch (error) {
    logger.info("route CHAT error: ", error);
    return res.status(500).json({ message: "Error loading /chat" });
  }
});

webRouter.get("/images", (req, res) => {
  try {
    res.render("images.handlebars", { pageTitle: "Images" });
  } catch (error) {
    logger.info(error);
    return res.status(500).json({ message: "Error loading /images" });
  }
});

webRouter.post("/images", upload.single("productImage"), (req, res) => {
  try {
    if (req.file.filename) {
      const imageUrl = path.join("/products", req.file.filename);
      res.json({ url: imageUrl });
    } else {
      throw new Error("No se recibió ninguna imagen");
    }
  } catch (error) {
    logger.info(error);
    return res.status(500).json({ message: "Error uploading /image" });
  }
});

webRouter.get("/carts/:id", async (req, res) => {
  try {
    const cartId = req.params.id;
    if (!cartId) throw new Error("cartId ID is required");

    const cart = await cartModel.findById(cartId).lean();

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    return res.render("cartDetails.handlebars", {
      pageTitle: `Cart ${cartId}`,
      cart,
      baseUrl: BASE_URL + "/",
    });
  } catch (error) {
    logger.info(error);
    return res.status(500).json({ message: "Error loading /carts/:id" });
  }
});

const spec = swaggerJsdoc(SWAGGER_CONFIG);
webRouter.use(
  "/api-docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(spec)
);

// AUTH
webRouter.use(sessionsRouter);
webRouter.use(usersRouter);

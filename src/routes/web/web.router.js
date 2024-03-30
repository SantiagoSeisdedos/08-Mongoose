import "dotenv/config";
import { Router } from "express";
import axios from "axios";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import { BASE_URL, SWAGGER_CONFIG } from "../../config/config.js";
import { usersRouter } from "./users.router.js";
import { sessionsRouter } from "./sessions.router.js";
import { upload } from "../../middlewares/saveImage.js";
import { logger } from "../../utils/logger.js";

export const webRouter = Router();

webRouter.get("/", (req, res) => {
  try {
    return res.render("home.handlebars", { pageTitle: "Home" });
  } catch (error) {
    logger.info(error);
    return res.status(500).json({ message: "Error loading home" });
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
      // O podrías renderizar una vista de "producto no encontrado"
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

webRouter.post("/images", upload.single("image"), (req, res) => {
  try {
    if (req.file.filename) res.json({ url: req.file.filename });
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
      // O podrías renderizar una vista de "producto no encontrado"
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

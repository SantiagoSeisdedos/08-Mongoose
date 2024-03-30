import { Router } from "express";
import {
  deleteProductController,
  getProductController,
  getProductsController,
  postProductController,
  putProductController,
} from "../../controllers/products.controller.js";
import {
  validateProductData,
  validateId,
  validateUpdates,
} from "../../middlewares/validations.js";
import { isAuthorized } from "../../middlewares/authorization.js";
import passport from "passport";

export const productsRouter = Router();

// GET
productsRouter.get("/", getProductsController);
productsRouter.get("/:id", validateId, getProductController);

// POST
productsRouter.post(
  "/",
  passport.authenticate("jwt", { failWithError: true, session: false }),
  isAuthorized(["admin", "premium"]),
  validateProductData,
  postProductController
);

// PUT
productsRouter.put(
  "/:id",
  passport.authenticate("jwt", { failWithError: true, session: false }),
  isAuthorized(["admin", "premium"]),
  validateUpdates,
  putProductController
);

// DELETE
productsRouter.delete(
  "/:id",
  passport.authenticate("jwt", { failWithError: true, session: false }),
  isAuthorized(["admin", "premium"]),
  validateId,
  deleteProductController
);

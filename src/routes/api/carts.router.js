import { Router } from "express";
import { validateId } from "../../middlewares/validations.js";
import {
  addProductToCartController,
  deleteProductFromCartController,
  deleteProductsFromCartController,
  getCartController,
  getCartsController,
  postCartController,
  updateProductCartController,
} from "../../controllers/carts.controller.js";
import passport from "passport";
import { isAuthorized } from "../../middlewares/authorization.js";

export const cartsRouter = Router();

cartsRouter.get("/", getCartsController);
cartsRouter.post("/", postCartController);

cartsRouter.get("/:id", validateId, getCartController);
// deletes all products from cart
cartsRouter.delete("/:id", validateId, deleteProductsFromCartController);

// Add product to cart by ID
cartsRouter.post(
  "/:id/product/:pid",
  passport.authenticate("jwt", { failWithError: true, session: false }),
  isAuthorized(["user", "admin", "premium"]),
  validateId,
  addProductToCartController
);

// Delete product from cart by ID
cartsRouter.delete(
  "/:id/product/:pid",
  validateId,
  deleteProductFromCartController
);

// Updates the quantity of a product in a cart
cartsRouter.put("/:id/product/:pid", validateId, updateProductCartController);

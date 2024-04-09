import { Router } from "express";
import passport from "passport";
import {
  getOrderController,
  postOrderController,
} from "../../controllers/orders.controller.js";
import { validateId } from "../../middlewares/validations.js";

export const ordersRouter = Router();

ordersRouter.post(
  "/:id",
  passport.authenticate("jwt", { failWithError: true, session: false }),
  postOrderController
);
ordersRouter.get("/:id", validateId, getOrderController);

import { Router } from "express";
import passport from "passport";
import { UserController } from "../../controllers/users.controller.js";
import { isAuthorized } from "../../middlewares/authorization.js";

export const usersRouter = Router();

usersRouter.post("/", UserController.register);
usersRouter.post("/reset", UserController.resetPassword);
usersRouter.post("/recoverAccount", UserController.recoverAccount);

usersRouter.get(
  "/current",
  passport.authenticate("jwt", { failWithError: true, session: false }),
  isAuthorized(["admin", "user"]),
  UserController.getCurrentUser
);

usersRouter.get(
  "/",
  passport.authenticate("jwt", { failWithError: true, session: false }),
  isAuthorized(["admin"]),
  UserController.getUsers
);

usersRouter.get(
  "/:email",
  UserController.getUser
);

usersRouter.put(
  "/",
  passport.authenticate("jwt", { failWithError: true, session: false }),
  UserController.updateUser
);

import { Router } from "express";
import passport from "passport";
import { UserController } from "../../controllers/users.controller.js";
import { isAuthorized } from "../../middlewares/authorization.js";
import { upload } from "../../middlewares/saveImage.js";

export const usersRouter = Router();

usersRouter.post("/", UserController.register);
usersRouter.post("/reset", UserController.resetPassword);
usersRouter.post("/recoverAccount", UserController.recoverAccount);
usersRouter.post(
  "/:uid/documents",
  upload.array("files"),
  UserController.uploadDocuments
);

usersRouter.get(
  "/current",
  passport.authenticate("jwt", { failWithError: true, session: false }),
  isAuthorized(["admin", "user", "premium"]),
  UserController.getCurrentUser
);

usersRouter.get("/:email", UserController.getUserByEmail);
usersRouter.get("/:id", UserController.getUserById);

usersRouter.put(
  "/",
  passport.authenticate("jwt", { failWithError: true, session: false }),
  UserController.updateUser
);

usersRouter.put(
  "/premium/:email",
  passport.authenticate("jwt", { failWithError: true, session: false }),
  UserController.updateRol
);

usersRouter.delete("/:id/documents/:doc", UserController.deleteDocument);

// ==============================
// Endpoints de la entrega del proyecto final
usersRouter.get(
  "/",
  // passport.authenticate("jwt", { failWithError: true, session: false }),
  // isAuthorized(["admin"]),
  UserController.getUsers
);

usersRouter.delete(
  "/",
  // passport.authenticate("jwt", { failWithError: true, session: false }),
  // isAuthorized(["admin"]),
  UserController.deleteUsers
);

usersRouter.delete(
  "/:email",
  // passport.authenticate("jwt", { failWithError: true, session: false }),
  // isAuthorized(["admin"]),
  UserController.deleteUser
);

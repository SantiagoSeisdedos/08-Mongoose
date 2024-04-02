import { Router } from "express";
import passport from "passport";

import {
  loginUserSessionController,
  logoutUserSessionController,
} from "../../controllers/sessions.controller.js";

export const sessionsRouter = Router();

sessionsRouter.post("/", loginUserSessionController);

sessionsRouter.delete(
  "/current",
  passport.authenticate("jwt", { failWithError: true, session: false }),
  logoutUserSessionController
);

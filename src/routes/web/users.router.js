import { Router } from "express";
import { logger } from "../../utils/logger.js";

export const usersRouter = Router();

usersRouter.get("/register", (req, res) => {
  try {
    return res.render("register.handlebars", { pageTitle: "Register" });
  } catch (error) {
    logger.info(error);
    return res.status(500).json({ message: "Error loading /register" });
  }
});

usersRouter.get("/resetPassword", (req, res) => {
  try {
    return res.render("resetPassword.handlebars", {
      pageTitle: "Reset Password",
    });
  } catch (error) {
    logger.info(error);
    return res.status(500).json({ message: "Error loading /resetPassword" });
  }
});

usersRouter.get("/edit", (req, res) => {
  try {
    return res.render("edit.handlebars", {
      pageTitle: "Edit Profiles",
    });
  } catch (error) {
    logger.info(error);
    return res.status(500).json({ message: "Error loading /resetPassword" });
  }
});

usersRouter.get("/profile", (req, res) => {
  try {
    return res.render("profile.handlebars", {
      pageTitle: "Profile",
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error loading /profile" });
  }
});

usersRouter.get("/recoverAccount", (req, res) => {
  try {
    return res.render("recoverAccount.handlebars", {
      pageTitle: "Recover Account",
    });
  } catch (error) {
    logger.info(error);
    return res.status(500).json({ message: "Error loading /recoverAccount" });
  }
});

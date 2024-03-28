import { JWT_SECRET } from "../config/config.js";
import { tokenizeUserInCookie } from "../middlewares/tokens.js";
import { usersService } from "../services/users.service.js";
import jwt from "jsonwebtoken";

export const UserController = {
  async register(req, res, next) {
    try {
      const user = await usersService.register(req.body);
      req.user = user;
      await tokenizeUserInCookie(req, res, next);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },

  async getCurrentUser(req, res, next) {
    try {
      const user = await usersService.getCurrentUser(req.user.email);
      const { name, lastName, email, rol, profilePicture, cart } = user;

      return res.json({
        data: { name, lastName, email, rol, profilePicture, cart },
      });
    } catch (error) {
      next(error);
    }
  },

  async getUsers(req, res, next) {
    try {
      const users = await usersService.getUsers();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  },

  async getUser(req, res, next) {
    try {
      const user = await usersService.getUser(req.params.email);
      return res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const user = await usersService.updateUser(req.user.email, req.body);
      return res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const response = await usersService.resetPassword(req.body.email);
      return res.json(response);
    } catch (error) {
      next(error);
    }
  },

  async recoverAccount(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      const decoded = jwt.verify(token, JWT_SECRET);

      const updatedPassword = await usersService.updatePassword(
        decoded.email,
        newPassword
      );

      return res.json(updatedPassword);
    } catch (error) {
      next(error);
    }
  },
};

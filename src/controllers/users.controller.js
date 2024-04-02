import { tokenizeUserInCookie } from "../middlewares/tokens.js";
import { usersService } from "../services/users.service.js";

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
      const {
        name,
        lastName,
        email,
        rol,
        profilePicture,
        cart,
        _id,
        documents,
      } = user;

      return res.json({
        data: {
          name,
          lastName,
          email,
          rol,
          profilePicture,
          cart,
          _id,
          documents,
        },
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

  async getUserByEmail(req, res, next) {
    try {
      const user = await usersService.getUserByEmail(req.params.email);
      return res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req, res, next) {
    try {
      const user = await usersService.getUserById(req.params.id);
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

  async updateRol(req, res, next) {
    try {
      const updatedUser = await usersService.updateRol(
        req.params.email,
        req.body.rol
      );
      return res.json(updatedUser);
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

      const updatedPassword = await usersService.updatePassword(
        token,
        newPassword
      );

      return res.json(updatedPassword);
    } catch (error) {
      next(error);
    }
  },

  async uploadDocuments(req, res, next) {
    try {
      const { uid } = req.params;
      const files = req.files;

      const updatedUser = await usersService.uploadDocuments(uid, files);

      return res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  },

  async deleteDocument(req, res, next) {
    try {
      const { id, doc } = req.params;

      const updatedUser = await usersService.deleteDocument(id, doc);

      return res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  },
};

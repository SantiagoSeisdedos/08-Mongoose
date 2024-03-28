import { daoUsers } from "../dao/daoInstance.js";
import { errorStatusMap } from "../utils/errorCodes.js";
import { emailService } from "./email/email.service.js";

class UserService {
  async register(userData) {
    try {
      const newUser = await daoUsers.register(userData);
      if (!newUser) {
        const error = new Error("Missing required fields");
        error.code = errorStatusMap.INCORRECT_DATA;
        throw error;
      }

      await emailService.send(
        userData.email,
        "bienvenido",
        "gracias por registrarse!"
      );

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(email) {
    try {
      const currentUser = await daoUsers.getCurrentUser(email);
      if (!currentUser) {
        const error = new Error("User not found");
        error.code = errorStatusMap.NOT_FOUND;
        throw error;
      }
      return currentUser;
    } catch (error) {
      throw error;
    }
  }

  async getUsers() {
    try {
      const users = await daoUsers.getUsers();
      if (!users) {
        const error = new Error("No users found");
        error.code = errorStatusMap.NOT_FOUND;
        throw error;
      }
      return users;
    } catch (error) {
      throw error;
    }
  }

  async getUser(email) {
    try {
      const user = await daoUsers.getUser(email);
      if (!user) {
        const error = new Error("User not found");
        error.code = errorStatusMap.NOT_FOUND;
        throw error;
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(email, userData) {
    try {
      const updatedUser = await daoUsers.updateUser(email, userData);
      if (!updatedUser) {
        const error = new Error("User not found");
        error.code = errorStatusMap.NOT_FOUND;
        throw error;
      }
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(email) {
    try {
      const deletedUser = await daoUsers.deleteUser(email);
      if (!deletedUser) {
        const error = new Error("User not found");
        error.code = errorStatusMap.NOT_FOUND;
        throw error;
      }
      return deletedUser;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(email) {
    try {
      await this.getUser(email);
      await daoUsers.sendPasswordResetEmail(email);
      return { message: "Email sent" };
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(email, newPassword) {
    try {
      const updatedPassword = await daoUsers.updatePassword(email, newPassword);
      if (!updatedPassword) {
        const error = new Error("Password not updated");
        error.code = errorStatusMap.UNEXPECTED_ERROR;
        throw error;
      }
      return updatedPassword;
    } catch (error) {
      throw error;
    }
  }
}

export const usersService = new UserService();

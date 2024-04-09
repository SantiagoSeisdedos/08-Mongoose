import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";

import { JWT_SECRET } from "../config/config.js";
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

  async getUserByEmail(email) {
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

  async getUserById(id) {
    try {
      const user = await daoUsers.getUserById(id);
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

  async updateRol(email, rol) {
    try {
      const updatedUser = await daoUsers.updateRol(email, rol);
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

  async deleteUsers() {
    try {
      const users = await daoUsers.getUsers();
      if (!users) {
        const error = new Error("No users found");
        error.code = errorStatusMap.NOT_FOUND;
        throw error;
      }

      // Aca vamos a calcular entre todos los users, cuales son los inactivos
      const currentDate = new Date();
      const inactiveUsers = users.filter((user) => {
        const lastConnection = new Date(user.last_connection);
        const timeDifference = currentDate.getTime() - lastConnection.getTime();
        // Definir el tiempo de inactividad en milisegundos
        // Para pruebas, podemos usar 1 minuto (60000), luego cambiar a 30 minutos (1800000)
        // y finalmente a 48 horas (172800000)
        // const inactiveTime = 60000; // 1 minuto para pruebas
        // const inactiveTime = 1800000; // 30 minutos
        const inactiveTime = 172800000; // 48 horas
        return timeDifference > inactiveTime;
      });

      inactiveUsers.forEach(async (user) => {
        await daoUsers.deleteUser(user.email);
        await emailService.send(
          user.email,
          "Cuenta eliminada",
          "Tu cuenta ha sido eliminada por inactividad"
        );
      });
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(email) {
    try {
      await this.getUserByEmail(email);
      await daoUsers.sendPasswordResetEmail(email);
      return { message: "Email sent" };
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(token, newPassword) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      const updatedPassword = await daoUsers.updatePassword(
        decoded.email,
        newPassword
      );
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

  async uploadDocuments(uid, files) {
    try {
      const user = await daoUsers.getUserById(uid);

      if (!user) {
        const error = new Error("User not found");
        error.code = errorStatusMap.NOT_FOUND;
        throw error;
      }

      if (!user.documents) {
        user.documents = [];
      }

      files.forEach((file) => {
        user.documents.push({
          name: file.originalname,
          reference: file.path,
        });
      });

      const updatedUser = await daoUsers.updateUser(user.email, {
        documents: user.documents,
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async deleteDocument(userId, docId) {
    try {
      const user = await daoUsers.getUserById(userId);

      if (!user) {
        const error = new Error("User not found");
        error.code = errorStatusMap.NOT_FOUND;
        throw error;
      }

      const currentDir = path.resolve();

      user.documents.forEach((doc) => {
        if (doc._id.toString() === docId) {
          const finalPath = `${currentDir}/${doc.reference}`;
          fs.unlinkSync(finalPath);
        }
      });

      const updatedDocuments = user.documents.filter(
        (doc) => doc._id.toString() !== docId
      );

      const updatedUser = await daoUsers.updateUser(user.email, {
        documents: updatedDocuments,
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}

export const usersService = new UserService();

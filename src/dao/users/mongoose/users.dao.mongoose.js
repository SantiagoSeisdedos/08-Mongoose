import jwt from "jsonwebtoken";
import { BASE_URL, JWT_SECRET } from "../../../config/config.js";
import { errorStatusMap } from "../../../utils/errorCodes.js";
import { emailService } from "../../../services/email/email.service.js";

export class UsersDaoMongoose {
  constructor(usersModel) {
    this.usersModel = usersModel;
  }

  async register(userData) {
    try {
      const newUser = await this.usersModel.register(userData);
      if (!newUser) {
        const error = new Error("User not created");
        error.code = errorStatusMap.UNEXPECTED_ERROR;
        throw error;
      }
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(email) {
    return await this.usersModel.findOne({ email }).lean();
  }

  async getUsers() {
    return await this.usersModel.find().lean();
  }

  async getUser(email) {
    return await this.usersModel.findOne({ email }).lean();
  }

  async authentication(credentials) {
    const user = await this.usersModel.authentication(credentials);
    return user;
  }

  async login(username, password) {
    const user = await this.usersModel.login(username, password);
    return user;
  }

  async updateUser(email, userData) {
    try {
      const updatedUser = await this.usersModel
        .findOneAndUpdate({ email }, userData, { new: true })
        .lean();

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

  async sendPasswordResetEmail(email) {
    // Generate a unique token
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

    // Create the reset password URL with the token
    const resetUrl = `${BASE_URL}/recoverAccount?token=${token}`;

    if (!resetUrl || !token) {
      const error = new Error("Error creating the reset password URL");
      error.code = errorStatusMap.UNEXPECTED_ERROR;
      throw error;
    }

    // Send the reset password email
    await emailService.send(
      email,
      "Recuperación de Contraseña",
      `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${resetUrl}`
    );
  }

  async updatePassword(email, newPassword) {
    try {
      const updatedPassword = await this.usersModel.updatePassword(
        email,
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
}

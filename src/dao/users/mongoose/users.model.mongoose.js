import mongoose from "mongoose";
import { randomUUID } from "node:crypto";

import { areHashesEqual, hashPassword } from "../../../utils/crypto.js";
import { errorStatusMap } from "../../../utils/errorCodes.js";

import {
  ADMIN_EMAIL,
  DEFAULT_USER_AVATAR_PATH,
} from "../../../config/config.js";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true, default: randomUUID },
    name: { type: String, required: true },
    lastName: { type: String, required: true, default: "(sin especificar)" },
    email: { type: String, unique: true, required: true },
    age: { type: Number },
    password: { type: String, required: true, default: "(no aplica)" },
    rol: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
    profilePicture: {
      type: String,
      required: true,
      default: DEFAULT_USER_AVATAR_PATH,
    },
    cart: {
      type: [
        {
          _id: {
            type: String,
            ref: "cart",
            required: true,
            default: randomUUID,
          },
        },
      ],
      default: "",
    },
  },
  {
    strict: "throw",
    versionKey: false,
    methods: {
      toPojo: () => {
        return JSON.parse(JSON.stringify(this));
      },
    },
    statics: {
      login: async function (email, password) {
        let userData;

        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
          userData = {
            email: "admin",
            name: "admin",
            lastName: "admin",
            rol: "admin",
          };
        } else {
          const user = await mongoose
            .model(collection)
            .findOne({ email })
            .lean();

          if (!user) {
            throw new Error("Login failed: Invalid credentials");
          }

          if (!areHashesEqual(password, user["password"])) {
            throw new Error("Login failed: Invalid credentials");
          }

          userData = {
            email: user["email"],
            name: user["name"],
            lastname: user["lastname"],
            rol: "user",
          };
        }
        return userData;
      },
      register: async function (userData) {
        try {
          if (!userData.email || !userData.password) {
            const error = new Error("Missing required fields");
            error.code = errorStatusMap.INCORRECT_DATA;
            throw error;
          }

          userData.password = await hashPassword(userData.password);

          if (userData.email === ADMIN_EMAIL) userData.rol = "admin";
          const user = await this.create(userData);

          return user.toObject();
        } catch (error) {
          if (error.code === 11000) {
            const typedError = new Error("User email already exists");
            typedError.code = errorStatusMap.DUPLICATED_KEY;
            throw typedError;
          } else throw error;
        }
      },
      authentication: async function ({ username, password, email }) {
        try {
          const query = username ? { username } : { email };
          const user = await this.findOne(query);
          if (!user || !(await areHashesEqual(password, user?.password))) {
            const error = new Error("Invalid credentials");
            error.code = errorStatusMap.UNAUTHORIZED;
            throw error;
          }
          return user.toObject();
        } catch (error) {
          throw error;
        }
      },
      updatePassword: async function (email, newPassword) {
        try {
          const user = await this.findOne({ email });
          if (!user) {
            const error = new Error("User not found");
            error.code = errorStatusMap.NOT_FOUND;
            throw error;
          }
          const hashedPassword = await hashPassword(newPassword);
          await this.findOneAndUpdate({ email }, { password: hashedPassword });
          return { message: "Password updated" };
        } catch (error) {
          throw error;
        }
      },
    },
  }
  // statics: {
  //   createOne: async function (userData) {
  //     await this.create(userData);
  //   },
  //   readOne: async function (query) {
  //     const userDoc = await this.findOne(query);
  //     return userDoc.toPojo();
  //   },
  //   readMany: async function () {
  //     const users = await this.find();
  //     return users.map((user) => user.toPojo());
  //   },
  //   updateOne: async function (email, userData) {
  //     await this.create(userData);
  //   },
  //   updateMany: async function (userData) {
  //     await this.create(userData);
  //   },
  //   deleteOne: async function (email) {
  //     await this.create(userData);
  //   },
  //   deleteMany: async function () {
  //     await this.create(userData);
  //   },
  // },
);

export default userSchema;

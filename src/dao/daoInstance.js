import { model } from "mongoose";

import {
  EXECUTION_ENV,
  CARTS_PATH_JSON,
  PRODUCTS_PATH_JSON,
  USERS_PATH_JSON,
  ORDERS_PATH_JSON,
} from "../config/config.js";

import { CartsDaoFiles } from "./carts/files/carts.dao.files.js";
import { CartsDaoMongoose } from "./carts/mongoose/carts.dao.mongoose.js";
import cartSchema from "./carts/mongoose/carts.model.mongoose.js";

import { ProductsDaoFiles } from "./products/files/products.dao.files.js";
import { ProductsDaoMongoose } from "./products/mongoose/products.dao.mongoose.js";
import productSchema from "./products/mongoose/products.model.mongoose.js";

import { UsersDaoFiles } from "./users/files/users.dao.files.js";
import { UsersDaoMongoose } from "./users/mongoose/users.dao.mongoose.js";
import userSchema from "./users/mongoose/users.model.mongoose.js";

import { OrdersDaoFiles } from "./orders/files/orders.dao.files.js";
import { OrdersDaoMongoose } from "./orders/mongoose/orders.dao.mongoose.js";
import orderSchema from "./orders/mongoose/orders.model.mongoose.js";

/**
 * Crea una instancia de DAO basada en el entorno de ejecución.
 * @param {Model} model El modelo Mongoose para el DAO de MongoDB.
 * @param {Class} ProdDao La clase DAO para el entorno de producción.
 * @param {Class} DevDao La clase DAO para el entorno de desarrollo.
 * @param {string} path La ruta del archivo JSON para el entorno de desarrollo.
 * @returns {Object} La instancia del DAO creada.
 */
function createDaoInstance(model, ProdDao, DevDao, path) {
  if (EXECUTION_ENV === "prod") {
    return new ProdDao(model);
  } else {
    return new DevDao(path);
  }
}

const cartsModel = model("carts", cartSchema);
const productsModel = model("products", productSchema);
const usersModel = model("users", userSchema);
const orderModel = model("orders", orderSchema);

// Crear instancias de DAO para carritos y productos
export const daoCarts = createDaoInstance(
  cartsModel,
  CartsDaoMongoose,
  CartsDaoFiles,
  CARTS_PATH_JSON
);
export const daoProducts = createDaoInstance(
  productsModel,
  ProductsDaoMongoose,
  ProductsDaoFiles,
  PRODUCTS_PATH_JSON
);
export const daoUsers = createDaoInstance(
  usersModel,
  UsersDaoMongoose,
  UsersDaoFiles,
  USERS_PATH_JSON
);

export const daoOrders = createDaoInstance(
  orderModel,
  OrdersDaoMongoose,
  OrdersDaoFiles,
  ORDERS_PATH_JSON
);

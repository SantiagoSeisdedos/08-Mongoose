import { errorStatusMap } from "../../../utils/errorCodes.js";
import { toPOJO } from "../../utils.js";

export class CartsDaoMongoose {
  constructor(cartsModel) {
    this.cartModel = cartsModel;
  }

  async readMany() {
    const carts = await this.cartModel.find().lean();
    return toPOJO(carts);
  }

  async readOne(id) {
    const cart = await this.cartModel.findById(id).lean();
    return toPOJO(cart);
  }

  async createOne(cartData) {
    const cart = await this.cartModel.create(cartData);
    return toPOJO(cart);
  }

  async updateOne(cartId, productId, quantity) {
    try {
      // Validación de datos
      if (!cartId || !productId || !quantity || isNaN(quantity)) {
        const error = new Error(
          "Se requieren cartId, productId y quantity, y quantity debe ser un número."
        );
        error.code = errorStatusMap.INCORRECT_DATA;
        throw error;
      }

      // Busca el carrito en la base de datos
      const cart = await this.cartModel.findById(cartId);

      if (!cart) {
        const error = new Error("Carrito no encontrado");
        error.code = errorStatusMap.NOT_FOUND;
        throw error;
      }

      // Busca el producto en el carrito
      const existingProduct = cart.products.find(
        (product) => product._id === productId
      );

      if (existingProduct) {
        // Si el producto ya está en el carrito, actualiza la cantidad
        existingProduct.quantity += parseInt(quantity);

        // Si la cantidad es menor o igual a 0, elimina el producto del carrito
        if (existingProduct.quantity <= 0) {
          cart.products = cart.products.filter(
            (product) => product._id !== productId
          );
        }
      } else {
        // Si el producto no está en el carrito y la cantidad es positiva, agrégalo
        if (parseInt(quantity) > 0) {
          cart.products.push({ _id: productId, quantity: parseInt(quantity) });
        }
      }

      // Guarda el carrito actualizado en la base de datos
      await cart.save();

      // Si no hay productos en el carrito, devuelve un carrito vacío
      if (cart.products.length === 0) {
        return { _id: cart._id, products: [] };
      }

      return cart;
    } catch (error) {
      throw error;
    }
  }

  async updateMany(query, data) {
    throw new Error("NOT IMPLEMENTED");
  }

  async deleteOne(id) {
    const cart = await this.cartModel.findByIdAndDelete(id).lean();
    return toPOJO(cart);
  }

  async deleteMany(query) {
    throw new Error("NOT ILEMENTED");
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      if (!cartId || !productId) {
        const error = new Error("Se requieren cartId y productId.");
        error.code = errorStatusMap.INCORRECT_DATA;
        throw error;
      }

      const cart = await this.cartModel.findById(cartId);

      if (!cart) {
        const error = new Error("Carrito no encontrado");
        error.code = errorStatusMap.NOT_FOUND;
        throw error;
      }

      cart.products = cart.products.filter(
        (product) => product._id !== productId
      );

      await cart.save();

      return cart;
    } catch (error) {
      console.error("deleteProductFromCart CARTS.DAO.MONGOOSE Error: ", error);
      throw new Error(
        `Error al eliminar el producto del carrito: ${error.message}`
      );
    }
  }

  async deleteProductsFromCart(cartId) {
    try {
      if (!cartId) {
        const error = new Error("Se requiere un cartId.");
        error.code = errorStatusMap.INCORRECT_DATA;
        throw error;
      }

      const cart = await this.cartModel.findById(cartId);

      if (!cart) {
        const error = new Error("Carrito no encontrado");
        error.code = errorStatusMap.NOT_FOUND;
        throw error;
      }

      cart.products = [];

      await cart.save();

      return cart;
    } catch (error) {
      throw new Error(
        `Error al eliminar los productos del carrito: ${error.message}`
      );
    }
  }
}

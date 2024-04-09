import { daoCarts, daoProducts } from "../dao/daoInstance.js";
import { errorStatusMap } from "../utils/errorCodes.js";

class CartsService {
  async readMany() {
    try {
      return daoCarts.readMany();
    } catch (error) {
      throw new Error(`Error en CartsService.readMany: ${error}`);
    }
  }

  async readOne(id) {
    try {
      if (!id) {
        const error = new Error("El ID es requerido");
        error.code = errorStatusMap.INCORRECT_DATA;
        throw error;
      }

      const cart = await daoCarts.readOne(id);
      if (!cart) {
        const error = new Error(
          `No se encontró ningún carrito con el ID ${id}`
        );
        error.code = errorStatusMap.NOT_FOUND;
        throw error;
      }

      return cart;
    } catch (error) {
      throw new Error(`Error en CartsService.readOne: ${error}`);
    }
  }

  async createOne() {
    try {
      const createdCart = await daoCarts.createOne({});
      if (!createdCart) {
        const error = new Error("No se pudo crear el carrito");
        error.code = errorStatusMap.UNEXPECTED_ERROR;
        throw error;
      }
      return createdCart;
    } catch (error) {
      throw new Error(`Error en CartsService.createOne: ${error}`);
    }
  }

  async addProductToCart(cartId = "123", productId, quantity) {
    try {
      if (!cartId || !productId || !quantity) {
        const error = new Error("Se requieren cartId, productId y quantity.");
        error.code = errorStatusMap.INCORRECT_DATA;
        throw error;
      }

      if (isNaN(quantity)) {
        const error = new Error("quantity debe ser un número.");
        error.code = errorStatusMap.INCORRECT_DATA;
        throw error;
      }

      const product = await daoProducts.readOne(productId);
      if (!product) {
        const error = new Error("Producto no encontrado.");
        error.code = errorStatusMap.NOT_FOUND;
        throw error;
      }

      const cart = await daoCarts.readOne(cartId);
      if (!cart) {
        const newCart = await daoCarts.createOne({
          _id: cartId,
          products: [{ _id: productId, quantity }],
        });
        console.log("newCart", newCart);
        return newCart;
      } else {
        const updatedCart = await daoCarts.updateOne(
          cartId,
          productId,
          quantity
        );
        console.log("updatedCart", updatedCart);
        return updatedCart;
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      if (!cartId || !productId) {
        const error = new Error("Se requieren cartId y productId.");
        error.code = errorStatusMap.INCORRECT_DATA;
        throw error;
      }

      const updatedCart = await daoCarts.deleteProductFromCart(
        cartId,
        productId
      );
      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  async deleteProductsFromCart(cartId) {
    try {
      if (!cartId) {
        const error = new Error("Se requiere un cartId.");
        error.code = errorStatusMap.INCORRECT_DATA;
        throw error;
      }

      const updatedCart = await daoCarts.deleteProductsFromCart(cartId);
      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  async deleteCart(cartId) {
    return daoCarts.deleteCart(cartId);
  }
}

export const cartsService = new CartsService();

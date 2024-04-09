import { cartsService } from "../services/carts.service.js";
import { errorStatusMap } from "../utils/errorCodes.js";

export async function getCartsController(req, res, next) {
  try {
    const carts = await cartsService.readMany();
    if (!carts.length) {
      const error = new Error("No se encontraron carritos.");
      error.code = errorStatusMap.NOT_FOUND;
      throw error;
    }

    res.status(200).json(carts);
  } catch (error) {
    next(error);
  }
}

export async function getCartController(req, res, next) {
  try {
    const { id } = req.params;
    const cart = await cartsService.readOne(id);

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}

export async function postCartController(req, res, next) {
  try {
    const newCart = await cartsService.createOne();
    if (!newCart) {
      const error = new Error("No se pudo crear el carrito");
      error.code = errorStatusMap.UNEXPECTED_ERROR;
      throw error;
    }

    res.status(201).json(newCart);
  } catch (error) {
    next(error);
  }
}

export async function addProductToCartController(req, res, next) {
  try {
    const { id, pid } = req.params;
    const { quantity = 1 } = req.body;

    const updatedCart = await cartsService.addProductToCart(id, pid, quantity);
    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
}

export async function updateProductCartController(req, res, next) {
  try {
    const { id, pid } = req.params;
    const { quantity } = req.body;

    const updatedCart = await cartsService.addProductToCart(id, pid, quantity);
    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
}

export async function deleteProductFromCartController(req, res, next) {
  try {
    const { id, pid } = req.params;

    const updatedCart = await cartsService.deleteProductFromCart(id, pid);
    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
}

export async function deleteProductsFromCartController(req, res, next) {
  try {
    const { id } = req.params;

    const updatedCart = await cartsService.deleteProductsFromCart(id);
    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
}

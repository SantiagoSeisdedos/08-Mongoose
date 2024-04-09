import { cartsService } from "../services/carts.service.js";
import { productsService } from "../services/products.service.js";
import { ordersService } from "../services/orders.service.js";
import { errorStatusMap } from "../utils/errorCodes.js";
import { emailService } from "../services/email/email.service.js";

export async function postOrderController(req, res, next) {
  try {
    const { id } = req.params;
    const email = req.user.email;

    // Obtener el carrito
    const cart = await cartsService.readOne(id);

    // Verificar stock y actualizarlo si es necesario
    const productsWithoutStock = [];
    let amount = 0;
    for (const product of cart.products) {
      const { _id, quantity } = product;
      const productInfo = await productsService.readOne(_id);

      if (!productInfo || productInfo.stock < quantity) {
        // Si no hay suficiente stock, agregar el producto a una lista para informar al usuario
        productsWithoutStock.push({
          product: _id,
          stock: productInfo ? productInfo.stock : 0,
        });
      } else {
        // Si hay suficiente stock, restar la cantidad comprada del stock y actualizar el producto
        productInfo.stock -= quantity;
        amount += productInfo.price * quantity;
        await productsService.updateOne(_id, productInfo);
      }
    }

    // Si hay productos sin stock suficiente, informar al usuario y no procesar la compra
    if (productsWithoutStock.length > 0) {
      const error = new Error("Stock insuficiente");
      error.products = productsWithoutStock;
      error.code = errorStatusMap.UNPROCESSABLE_ENTITY;

      await emailService.send(
        email,
        "Compra cancelada",
        `No se pudo procesar la compra debido a stock insuficiente en los siguientes productos: ${productsWithoutStock
          .map((product) => product.product)
          .join(", ")}`
      );

      throw error;
    }

    // Crear la orden
    const newOrder = await ordersService.createOne({
      purchaser: email,
      amount: amount,
    });

    // Limpiar el carrito
    await cartsService.deleteProductsFromCart(id);

    // Enviar email de confirmación
    await emailService.send(
      email,
      "Compra realizada",
      `Se ha realizado la compra por un total de $${amount}`
    );

    res.status(200).json(newOrder);
  } catch (error) {
    next(error);
  }
}

export async function getOrderController(req, res, next) {
  try {
    const { id } = req.params;
    const cart = await cartsService.readOne(id);
    const productSummary = await ordersService.createCheckoutFlow(cart);

    res.status(200).json(productSummary);
  } catch (error) {
    next(error);
  }
}

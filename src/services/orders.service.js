import { daoOrders } from "../dao/daoInstance.js";
import { errorStatusMap } from "../utils/errorCodes.js";
import { productsService } from "./products.service.js";

export class OrdersService {
  async createOne(orderData) {
    try {
      const newOrder = await daoOrders.createOne(orderData);
      if (!newOrder) {
        const error = new Error("No se pudo crear la orden");
        error.code = errorStatusMap.UNEXPECTED_ERROR;
        throw error;
      }

      return newOrder;
    } catch (error) {
      throw error;
    }
  }

  async createCheckoutFlow(cart) {
    try {
      const productSummaries = [];
      for (const productEntry of cart.products) {
        const product = await productsService.readOne(productEntry._id);
        if (product) {
          const total = product.price * productEntry.quantity;
          productSummaries.push({
            
            title: product.title,
            code: product.code,
            price: product.price,
            quantity: productEntry.quantity,
            total: total,
          });
        }
      }

      const totalAmount = productSummaries.reduce(
        (acc, curr) => acc + curr.total,
        0
      );

      return {
        products: productSummaries,
        totalAmount: totalAmount,
      };
    } catch (error) {
      throw new Error(`Error en CartsService.readOne: ${error}`);
    }
  }
}

export const ordersService = new OrdersService();

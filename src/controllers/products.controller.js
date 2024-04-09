import { productsService } from "../services/products.service.js";
import { errorStatusMap } from "../utils/errorCodes.js";

export async function getProductsController(req, res, next) {
  try {
    const { limit, page, sort, query } = req.query;

    const productsWithPagination = await productsService.readMany({
      limit,
      page,
      sort,
      query,
    });

    if (!productsWithPagination.products.length) {
      const error = new Error("No se encontraron productos.");
      error.code = errorStatusMap.NOT_FOUND;
      throw error;
    }

    res.json(productsWithPagination);
  } catch (error) {
    next(error);
  }
}

export async function getProductController(req, res, next) {
  try {
    const { id } = req.params;
    const product = await productsService.readOne(id);
    if (!product) {
      const error = new Error(`No se encontró ningún producto con el ID ${id}`);
      error.code = errorStatusMap.NOT_FOUND;
      throw error;
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function postProductController(req, res, next) {
  try {
    const product = await productsService.createOne({
      ...req.body,
      owner: req.user.email,
    });

    if (!product) {
      const error = new Error("No se pudo crear el producto");
      error.code = errorStatusMap.UNEXPECTED_ERROR;
      throw error;
    }

    res.status(201).json(product);
    next();
  } catch (error) {
    next(error);
  }
}

export async function putProductController(req, res, next) {
  try {
    const { id } = req.params;
    const product = await productsService.updateOne(id, req.body, {
      email: req.user.email,
      rol: req.user.rol,
    });

    res.json({
      status: 201,
      message: "Producto actualizado correctamente.",
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProductController(req, res, next) {
  try {
    const { id } = req.params;
    const products = await productsService.deleteOne(id, {
      email: req.user.email, // Email del usuario autenticado
      rol: req.user.rol, // Rol del usuario autenticado
    });

    res.json({
      status: 204,
      message: "Producto eliminado correctamente.",
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

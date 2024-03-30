import { toPOJO } from "../../utils.js";

export class ProductsDaoMongoose {
  constructor(productsModel) {
    this.productsModel = productsModel;
  }

  async readMany(filter, options) {
    const { page, limit, sort } = options;
    const skip = (page - 1) * limit;

    const query = this.productsModel.find(filter).skip(skip).limit(limit);

    if (sort) {
      query.sort(sort);
    }

    const products = await query.lean();
    return toPOJO(products);
  }

  async readOne(id) {
    const product = await this.productsModel.findById(id).lean();
    return toPOJO(product);
  }

  async createOne(data) {
    const product = await this.productsModel.create(data);
    return toPOJO(product);
  }

  async updateOne(id, updates) {
    const product = await this.productsModel
      .findByIdAndUpdate(id, updates, { new: true })
      .lean();
    return toPOJO(product);
  }

  async updateMany(query, data) {
    throw new Error("NOT IMPLEMENTED");
  }

  async deleteOne(id) {
    const product = await this.productsModel.findByIdAndDelete(id).lean();
    return toPOJO(product);
  }

  async deleteMany(query) {
    throw new Error("NOT ILEMENTED");
  }

  async count(filter) {
    return await this.productsModel.countDocuments(filter);
  }
}

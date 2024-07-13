import ProductSchema from "../schemas/products.schema.js";

class ProductManager {
  async getProducts() {
    try {
      const prods = await ProductSchema.find().lean();
      return prods;
    } catch (error) {
      throw { msg: `Error al obtener los productos`, error };
    }
  }

  async addProduct({title, description, stock, code, price}) {
    try {
      const prod = await ProductSchema.create({
        title,
        description,
        stock,
        code,
        price,
      });
      return { prod };
    } catch (error) {
      throw { msg: `Error al agregar el producto`, error };
    }
  }

  async getProductById(id) {
    try {
      const prod = await ProductSchema.findById(id).lean();
      if (!prod) {
        throw { msg: `No se encontró el producto con el id ${id}` };
      }
      return { prod };
    } catch (error) {
      throw { msg: `Error al obtener el producto`, error };
    }
  }

  async deleteProduct(id) {
    try {
      const prod = await ProductSchema.findByIdAndDelete(id).lean();
      if (!prod) {
        throw { msg: `No se encontró el producto con el id ${id}` };
      }
      return { msg: `Producto eliminado correctamente` };
    } catch (error) {
      throw { msg: `Error al eliminar el producto`, error };
    }
  }
}

export { ProductManager };
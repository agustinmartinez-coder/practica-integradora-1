// prodRouter.js

import { Router } from "express";
import { ProductManager } from "../dao/mongoDB/controllers/productManager.js";

const prodRouter = Router();
const productManager = new ProductManager();

prodRouter.get("/", async (req, res) => {
  try {
    const { prods, ok, msg, error } = await productManager.getProducts();
    if (prods) {
      res.status(200).json({ prods });
    } else {
      res.status(404).send({ respuesta: "Error", msg, error });
    }
  } catch (error) {
    res.status(500).send({
      respuesta: "Error",
      error,
    });
  }
});

prodRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { prodById, ok, msg, error } = await productManager.getProductById(
      id
    );

    if (prodById) {
      res.status(200).json({
        ok,
        prodById,
      });
    } else {
      res.status(404).json({
        ok,
        msg,
        error,
      });
    }
  } catch (error) {
    res.status(500).send({
      respuesta: "Error",
      error,
    });
  }
});

prodRouter.post("/", async (req, res) => {
  const { title, description, stock, code, price, thumbnail } = req.body;
  try {
    const {prod} = await productManager.addProduct(
      title,
      description,
      stock,
      code,
      price,
      thumbnail
    );
    res.status(200).json(prod)
  } catch (error) {}
});

prodRouter.put("/:id", async (req, res) => {});

prodRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { msg, error } = await productManager.deleteProduct(id);
    res.status(200).send({ respuesta: "Ok", mensaje: msg });
  } catch (error) {
    res.status(500).send({ respuesta: "Error en el servidor", mensaje: error });
  }
});

export { prodRouter };
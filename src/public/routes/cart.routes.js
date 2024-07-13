// cart.router.js
import { Router } from "express";
import CartManager from "../dao/mongoDB/controllers/cartManager.js";

const cartRouter = Router();
const cartManager = new CartManager();

cartRouter.get("/:cid", async (req, res) => {
  await cartManager.getCartById(req, res);
});

cartRouter.post("/", async (req, res) => {
  await cartManager.createCart(req, res);
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
  await cartManager.addProductToCart(req, res);
});

export { cartRouter };
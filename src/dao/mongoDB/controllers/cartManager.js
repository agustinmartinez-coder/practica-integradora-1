// cartManager.js
import { cartModel } from '../schemas/carts.schema.js';
import productsSchema from "../schemas/products.schema.js";

class CartManager {
    async getCartById(req, res) {
        const { cid } = req.params;

        try {
            const cart = await cartModel.findById(cid);
            if (cart) {
                res.status(200).send({ respuesta: "Ok", mensaje: cart });
            } else {
                res.status(404).send({
                    respuesta: "Error en consultar carrito",
                    mensaje: "No encontrado",
                });
            }
        } catch (error) {
            res
                .status(400)
                .send({ respuesta: "error en consultar carrito", mensaje: error });
        }
    }

    async createCart(req, res) {
        try {
            const cart = await cartModel.create()
            res.status(200).send({ respuesta: "ok", mensaje: cart });
        } catch (error) {
            res
                .status(400)
                .send({ respuesta: "Error en crear carrito", mensaje: error });
        }
    }

    async addProductToCart(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        try {
            const cart = await cartModel.findById(cid);

            if (cart) {
                const isProd = await productsSchema.findById(pid);
                if (isProd) {
                    const indice = cart.products.findIndex(prod => prod.id_prod === pid)
                    if (indice != -1) {
                        cart.products[indice].quantity === quantity
                    } else {
                        cart.products.push({ id_prod: pid, quantity: quantity })
                    }
                } else {
                    res.status(404).send({
                        respuesta: "Error en agregar producto al carrito",
                        mensaje: "No encontrado",
                    });
                }
            } else {
                res.status(404).send({
                    respuesta: "Error en consultar carrito",
                    mensaje: "No encontrado",
                });
            }
        } catch (error) {
            res.status(400).send({
                respuesta: "Error en agregar producto al carrito",
                mensaje: error,
            });
        }
    }
}

export default CartManager;
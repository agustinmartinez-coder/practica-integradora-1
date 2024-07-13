import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { connectionToDB } from "./dao/mongoDB/dbConnection.js";
import { ProductManager } from "./dao/mongoDB/controllers/productManager.js";
import {
  prodRouter,
  cartRouter,
  homeRouter,
  realTimeRouter,
  chatRouter,
} from "./routes/index.js";

import { __dirname } from "./path.js";
import { messagesModel } from "./dao/mongoDB/schemas/messages.schema.js";

const PORT = 8080;

const app = express();
const server = createServer(app);
const io = new Server(server);

const productManager = new ProductManager();

// Conexión a mongodb
connectionToDB();

server.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`);
});

// ** Middlewares **
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ** Setting public **
app.use("/", express.static(path.join(__dirname, "/public")));

// ** Handlebars **
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

// ** Socket **
io.on("connection", (socket) => {
  console.log("socket conectado");
  socket.on("getProducts", async () => {
    try {
      const products = await productManager.getProducts();
      io.emit("prodsData", products);
    } catch (error) {
      console.error("Error getting products:", error);
    }
  });

  socket.on("newProduct", async (newProd) => {
    try {
      await productManager.addProduct(newProd);
      const products = await productManager.getProducts();
      io.emit("prodsData", products);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  });

  socket.on("removeProduct", async (prodId) => {
    try {
      await productManager.deleteProduct(prodId);
      io.emit("productRemoved", prodId);
    } catch (error) {
      console.error("Error removing product:", error);
    }
  });
  socket.on("newMessage", async ({ email, message }) => {
    console.log(message);
    await messagesModel.create({ email: email, message: message });
    const messages = await messagesModel.find();
    io.emit("showMessages", messages); 
});

  socket.on("loadChats", async () => {
    const messages = await messagesModel.find();
    socket.emit("showMessages", messages);
  });
});

// ** Routes / Endpoints **
app.use("/api/products", prodRouter);
app.use("/api/carts", cartRouter);

app.use("/home", homeRouter);
app.use("/realtimeproducts", realTimeRouter);
app.use("/chat", chatRouter);
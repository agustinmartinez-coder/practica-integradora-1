import { Router } from "express";
import { messagesModel } from "../dao/mongoDB/schemas/messages.schema.js";

const chatRouter = Router();

chatRouter.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const getMessages = await messagesModel.find().limit(limit);

    // Render the page
    res.status(200).render("pages/chat", {
      js: "chat.js",
      styles: "styles",
      titulo: "Chat",
      error: null,
      messages: getMessages 
    });
  } catch (error) {
    res.status(400).send({ response: "Error", message: error });
  }
});

chatRouter.post("/", async (req, res) => {
  const { email, message } = req.body;
  try {
    const newMessage = await messagesModel.create({ email, message });

    req.app.io.emit("newMessage", newMessage);

    res.status(200).send({ response: "Mensaje enviado", mensaje: newMessage });
  } catch (error) {
    res.status(400).send({ response: "Error", message: error });
  }
});

export { chatRouter };
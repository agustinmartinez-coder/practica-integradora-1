import mongoose from "mongoose";

export const connectionToDB = () =>
  mongoose
    .connect(
      "[]mongodb+srv://am6591944:Ob90nYqkPCCbOLaV@cluster0.yf0tkel.mongodb.net/"
    )
    .then(() => console.log("BBDD Conectada exitosamente"))
    .catch(() => console.log("Hubo un error en la conexión con la BBDD"));
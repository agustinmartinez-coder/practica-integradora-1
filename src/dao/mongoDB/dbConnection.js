import mongoose from "mongoose";

export const connectionToDB = () =>
  mongoose
    .connect(
       " mongodb+srv://am6591944:<Javiermilei2023>@cluster0.vprfeye.mongodb.net/"
    )
    .then(() => console.log("BBDD Conectada exitosamente"))
    .catch(() => console.log("Hubo un error en la conexión con la BBDD"));
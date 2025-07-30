// importar la libreria moongoose
import mongoose, { connect } from "mongoose";
// Importo mi archivo config con todas las variables
import { config } from "./src/config.js";

// 2- Conecto la base de datos
mongoose.connect(config.db.URI);

// -------------- Comprobar que todo funcione --------------

// 3- Creo una constante que es igual a la conexion
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("DB is connected");
});

connection.on("disconnected", () => {
  console.log("Db is disconnected");
});

// Veo si hay un error
connection.on("error", (error) => {
  console.log("error found" + error);
});
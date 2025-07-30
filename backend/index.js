//Importo el archivo app.js
import app from "./app.js"

//Importar el archivo de conexión de la base de datos 
import "./database.js";

//Importo el archivo config 
import { config } from "./src/config.js";

//Luego creo una función que ejecuta el servidor 
async function main() {
    app.listen(config.server.port);
    console.log("Server running: " + config.server.port);
}

//Ejecuto la función
main();
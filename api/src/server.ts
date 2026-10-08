import express = require("express");
import dotenv = require("dotenv");
import cors = require("cors");
import morgan = require("morgan");

const app = express();
// Acceder a la configuracion del archivo .env
dotenv.config();
// Puerto que escucha por defecto 3000 o definido .env
const port = process.env.PORT || 3000;
// Middleware CORS para aceptar llamadas en el servidor
app.use(cors());
// Middleware para loggear las llamadas al servidor
app.use(morgan("dev"));
// Middleware para gestionar Requests y Response json
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.get("/", (req, res) => {
    res.json({
        message: "API de flotas Mantenidas funcionando correctamente",
    });
});
//---- Definir rutas ----

// Handle errors middleware

//Acceso a las imágenes

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
    console.log("Presione CTRL-C para detenerlo\n");
});

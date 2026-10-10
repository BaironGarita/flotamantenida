import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import { StatusCodes } from "http-status-codes";
import { AppRoutes } from "./routes/routes";
import { errorHandler } from "./utils/error-handler.middleware";
import { prisma } from "./config/prisma";

export const app = express();
const port = Number(process.env.PORT || 3000);

// Middleware CORS para aceptar llamadas en el servidor.
app.use(cors());
// Middleware para registrar las llamadas al servidor.
app.use(morgan("dev"));
// Middleware para gestionar requests y responses JSON.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.json({ message: "API de flotas Mantenidas funcionando correctamente" });
});

// ---- Definir rutas ----
app.use(AppRoutes.routes);
app.use((request, response) => {
  response.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Ruta no encontrada" });
});

// Middleware centralizado para manejar errores.
app.use(errorHandler);

// Al importar el servidor en las pruebas no se abre un puerto automáticamente.
if (require.main === module) {
  const server = app.listen(port, () => {
    console.log(`http://localhost:${port}`);
    console.log("Presione CTRL-C para detenerlo");
  });

  const cerrar = () => {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };
  process.once("SIGINT", cerrar);
  process.once("SIGTERM", cerrar);
}

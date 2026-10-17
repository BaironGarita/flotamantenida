import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import { AppRoutes } from "./routes/routes";
import { ErrorMiddleware } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/not-found.middleware";
import { sendSuccess } from "./utils/http-response";
import { prisma } from "./config/prisma";

import { uploadDir } from "./middlewares/image-config.middleware";

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
  sendSuccess(response, { message: "API de Flota Mantenida funcionando correctamente" });
});

// ---- Definir rutas ----
app.use(AppRoutes.routes);
app.use("/images", express.static(uploadDir, { dotfiles: "deny", index: false }));
app.use(notFoundHandler);

// Middleware centralizado para manejar errores.
app.use(ErrorMiddleware.handleError);

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

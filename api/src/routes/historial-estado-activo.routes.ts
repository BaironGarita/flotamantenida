import { Router } from "express";
import { HistorialEstadoActivoController } from "../controllers/historial-estado-activo.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

export class HistorialEstadoActivoRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new HistorialEstadoActivoController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    return router;
  }
}

import { Router } from "express";
import { HistorialEstadoOrdenController } from "../controllers/historial-estado-orden.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

export class HistorialEstadoOrdenRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new HistorialEstadoOrdenController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    return router;
  }
}

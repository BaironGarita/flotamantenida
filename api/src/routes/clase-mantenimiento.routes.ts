import { Router } from "express";
import { ClaseMantenimientoController } from "../controllers/clase-mantenimiento.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

export class ClaseMantenimientoRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ClaseMantenimientoController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    return router;
  }
}

import { Router } from "express";
import { EstadoActivoController } from "../controllers/estado-activo.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

export class EstadoActivoRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new EstadoActivoController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    return router;
  }
}

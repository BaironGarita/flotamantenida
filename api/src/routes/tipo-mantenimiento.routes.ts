import { Router } from "express";
import { TipoMantenimientoController } from "../controllers/tipo-mantenimiento.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

export class TipoMantenimientoRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new TipoMantenimientoController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    return router;
  }
}

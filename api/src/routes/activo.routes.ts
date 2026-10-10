import { Router } from "express";
import { ActivoController } from "../controllers/activo.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

export class ActivoRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ActivoController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    return router;
  }
}

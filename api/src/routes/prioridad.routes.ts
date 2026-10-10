import { Router } from "express";
import { PrioridadController } from "../controllers/prioridad.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

export class PrioridadRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new PrioridadController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    return router;
  }
}

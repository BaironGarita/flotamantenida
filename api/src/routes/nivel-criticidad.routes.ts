import { Router } from "express";
import { NivelCriticidadController } from "../controllers/nivel-criticidad.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

export class NivelCriticidadRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new NivelCriticidadController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    return router;
  }
}

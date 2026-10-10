import { Router } from "express";
import { RepuestoController } from "../controllers/repuesto.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

export class RepuestoRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new RepuestoController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    return router;
  }
}

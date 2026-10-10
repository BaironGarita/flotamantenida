import { Router } from "express";
import { ModeloController } from "../controllers/modelo.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

export class ModeloRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ModeloController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    return router;
  }
}

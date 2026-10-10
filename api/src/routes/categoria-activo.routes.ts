import { Router } from "express";
import { CategoriaActivoController } from "../controllers/categoria-activo.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

export class CategoriaActivoRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new CategoriaActivoController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    return router;
  }
}

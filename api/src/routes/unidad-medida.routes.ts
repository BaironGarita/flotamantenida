import { Router } from "express";
import { UnidadMedidaController } from "../controllers/unidad-medida.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

export class UnidadMedidaRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new UnidadMedidaController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    return router;
  }
}

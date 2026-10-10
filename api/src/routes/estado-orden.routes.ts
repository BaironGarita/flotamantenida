import { Router } from "express";
import { EstadoOrdenController } from "../controllers/estado-orden.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

export class EstadoOrdenRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new EstadoOrdenController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    return router;
  }
}

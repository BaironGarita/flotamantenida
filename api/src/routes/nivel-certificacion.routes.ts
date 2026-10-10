import { Router } from "express";
import { NivelCertificacionController } from "../controllers/nivel-certificacion.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

export class NivelCertificacionRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new NivelCertificacionController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    return router;
  }
}

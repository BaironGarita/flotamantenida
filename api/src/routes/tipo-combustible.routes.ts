import { Router } from "express";
import { TipoCombustibleController } from "../controllers/tipo-combustible.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

export class TipoCombustibleRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new TipoCombustibleController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    return router;
  }
}

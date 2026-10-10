import { Router } from "express";
import { TecnicoController } from "../controllers/tecnico.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

export class TecnicoRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new TecnicoController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    return router;
  }
}

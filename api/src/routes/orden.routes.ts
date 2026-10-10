import { Router } from "express";
import { OrdenController } from "../controllers/orden.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

export class OrdenRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new OrdenController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/usuario", asyncHandler(controller.listarPorUsuario));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    return router;
  }
}

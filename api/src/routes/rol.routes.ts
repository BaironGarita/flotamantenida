import { Router } from "express";
import { RolController } from "../controllers/rol.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

export class RolRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new RolController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    return router;
  }
}

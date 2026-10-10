import { Router } from "express";
import { ProveedorController } from "../controllers/proveedor.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

export class ProveedorRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ProveedorController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    return router;
  }
}

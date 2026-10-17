import { Router } from "express";
import { ProveedorController } from "../controllers/proveedor.controller";
import { asyncHandler } from "../utils/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createProveedorSchema, updateProveedorSchema } from "../dtos/catalog-crud.dto";

export class ProveedorRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ProveedorController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    router.post("/", validateRequest(createProveedorSchema), asyncHandler(controller.crear));
    router.put("/:id", validateRequest(updateProveedorSchema), asyncHandler(controller.actualizar));
    return router;
  }
}

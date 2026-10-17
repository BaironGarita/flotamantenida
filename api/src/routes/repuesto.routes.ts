import { Router } from "express";
import { RepuestoController } from "../controllers/repuesto.controller";
import { asyncHandler } from "../utils/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createRepuestoSchema, updateRepuestoSchema, associateRepuestoProveedorSchema } from "../dtos/catalog-crud.dto";

export class RepuestoRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new RepuestoController();
    router.get("/stock-bajo", asyncHandler(controller.listarStockBajo));
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    router.post("/", validateRequest(createRepuestoSchema), asyncHandler(controller.crear));
    router.put("/:id", validateRequest(updateRepuestoSchema), asyncHandler(controller.actualizar));
    router.post("/:id/proveedores", validateRequest(associateRepuestoProveedorSchema), asyncHandler(controller.asociarProveedor));
    router.put("/:id/proveedores/:proveedorId", validateRequest(associateRepuestoProveedorSchema.omit({ proveedorId: true } as const)), asyncHandler(controller.actualizarProveedor));
    return router;
  }
}

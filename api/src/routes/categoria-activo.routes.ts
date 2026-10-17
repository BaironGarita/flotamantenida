import { Router } from "express";
import { CategoriaActivoController } from "../controllers/categoria-activo.controller";
import { asyncHandler } from "../utils/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createCategoriaActivoSchema, updateCategoriaActivoSchema } from "../dtos/catalog-crud.dto";

export class CategoriaActivoRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new CategoriaActivoController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    router.post("/", validateRequest(createCategoriaActivoSchema), asyncHandler(controller.crear));
    router.put("/:id", validateRequest(updateCategoriaActivoSchema), asyncHandler(controller.actualizar));
    router.delete("/:id", asyncHandler(controller.desactivar));
    return router;
  }
}

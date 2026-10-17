import { Router } from "express";
import { EspecialidadController } from "../controllers/especialidad.controller";
import { asyncHandler } from "../utils/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createEspecialidadSchema, updateEspecialidadSchema } from "../dtos/catalog-crud.dto";

export class EspecialidadRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new EspecialidadController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    router.post("/", validateRequest(createEspecialidadSchema), asyncHandler(controller.crear));
    router.put("/:id", validateRequest(updateEspecialidadSchema), asyncHandler(controller.actualizar));
    return router;
  }
}

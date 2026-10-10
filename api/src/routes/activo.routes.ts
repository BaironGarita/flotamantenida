import { Router } from "express";
import { ActivoController } from "../controllers/activo.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

import { validateRequest } from "../middlewares/validate-request.middleware";
import { createActivoSchema, updateActivoSchema } from "../dtos/activo.dto";

export class ActivoRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ActivoController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    router.post("/", validateRequest(createActivoSchema), asyncHandler(controller.crear));
    router.put("/:id", validateRequest(updateActivoSchema), asyncHandler(controller.actualizar));
    return router;
  }
}

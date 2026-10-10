import { Router } from "express";
import { OrdenController } from "../controllers/orden.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

import { validateRequest } from "../middlewares/validate-request.middleware";
import { createOrdenSchema, updateOrdenSchema } from "../dtos/orden.dto";

export class OrdenRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new OrdenController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/usuario", asyncHandler(controller.listarPorUsuario));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    router.post("/", validateRequest(createOrdenSchema), asyncHandler(controller.crear));
    router.put("/:id", validateRequest(updateOrdenSchema), asyncHandler(controller.actualizar));
    return router;
  }
}

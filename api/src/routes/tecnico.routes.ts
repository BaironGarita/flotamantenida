import { Router } from "express";
import { TecnicoController } from "../controllers/tecnico.controller";
import { asyncHandler } from "../utils/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createTecnicoSchema, updateTecnicoSchema, associateTecnicoEspecialidadSchema } from "../dtos/catalog-crud.dto";

export class TecnicoRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new TecnicoController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    router.post("/", validateRequest(createTecnicoSchema), asyncHandler(controller.crear));
    router.put("/:id", validateRequest(updateTecnicoSchema), asyncHandler(controller.actualizar));
    router.post("/:id/especialidades", validateRequest(associateTecnicoEspecialidadSchema), asyncHandler(controller.asociarEspecialidad));
    router.delete("/:id/especialidades/:especialidadId", asyncHandler(controller.desasociarEspecialidad));
    return router;
  }
}

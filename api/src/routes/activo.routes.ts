import { Router } from "express";
import { ActivoController } from "../controllers/activo.controller";
import { asyncHandler } from "../utils/async-handler.middleware";

import { validateRequest } from "../middlewares/validate-request.middleware";
import { createActivoSchema, updateActivoSchema } from "../dtos/activo.dto";
import { updateActivoEstadoSchema } from "../dtos/catalog-crud.dto";

import { ImageController } from "../controllers/image.controller";
import { uploadImage } from "../middlewares/image-config.middleware";
import { parseId } from "../utils/parse-id";

export class ActivoRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ActivoController();
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));
    router.post("/", validateRequest(createActivoSchema), asyncHandler(controller.crear));
    router.put("/:id", validateRequest(updateActivoSchema), asyncHandler(controller.actualizar));
    router.put("/:id/estado", validateRequest(updateActivoEstadoSchema), asyncHandler(controller.cambiarEstado));
    router.put("/:id/baja", asyncHandler(controller.darDeBaja));
    // Validar el ID antes de escribir un archivo en disco.
    router.put("/:id/imagen", (req, _res, next) => { parseId(req.params.id); next(); }, uploadImage, asyncHandler(new ImageController().updateActivo));
    return router;
  }
}

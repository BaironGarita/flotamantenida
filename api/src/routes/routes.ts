import { Router } from "express";
import { ActivoRoutes } from "./activo.routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    router.use("/activo", ActivoRoutes.routes);
    return router;
  }
}

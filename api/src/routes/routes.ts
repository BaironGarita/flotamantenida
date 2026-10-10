import { Router } from "express";
import { ActivoRoutes } from "./activo.routes";
import { RolRoutes } from "./rol.routes";
import { EstadoActivoRoutes } from "./estado-activo.routes";
import { EstadoOrdenRoutes } from "./estado-orden.routes";
import { CategoriaActivoRoutes } from "./categoria-activo.routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    router.use("/activo", ActivoRoutes.routes);
    router.use("/rol", RolRoutes.routes);
    router.use("/estadoActivo", EstadoActivoRoutes.routes);
    router.use("/estadoOrden", EstadoOrdenRoutes.routes);
    router.use("/categoriaActivo", CategoriaActivoRoutes.routes);
    return router;
  }
}

import { Router } from "express";
import { ActivoRoutes } from "./activo.routes";
import { RolRoutes } from "./rol.routes";
import { EstadoActivoRoutes } from "./estado-activo.routes";
import { EstadoOrdenRoutes } from "./estado-orden.routes";
import { CategoriaActivoRoutes } from "./categoria-activo.routes";
import { ClaseMantenimientoRoutes } from "./clase-mantenimiento.routes";
import { PrioridadRoutes } from "./prioridad.routes";
import { NivelCriticidadRoutes } from "./nivel-criticidad.routes";
import { TipoCombustibleRoutes } from "./tipo-combustible.routes";
import { UnidadMedidaRoutes } from "./unidad-medida.routes";
import { NivelCertificacionRoutes } from "./nivel-certificacion.routes";
import { MarcaRoutes } from "./marca.routes";
import { ModeloRoutes } from "./modelo.routes";
import { EspecialidadRoutes } from "./especialidad.routes";
import { TipoMantenimientoRoutes } from "./tipo-mantenimiento.routes";
import { TecnicoRoutes } from "./tecnico.routes";
import { RepuestoRoutes } from "./repuesto.routes";
import { ProveedorRoutes } from "./proveedor.routes";
import { UsuarioRoutes } from "./usuario.routes";
import { OrdenRoutes } from "./orden.routes";
import { HistorialEstadoActivoRoutes } from "./historial-estado-activo.routes";
import { HistorialEstadoOrdenRoutes } from "./historial-estado-orden.routes";

import { ImageRoutes } from "./image.routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    router.use("/activo", ActivoRoutes.routes);
    router.use("/rol", RolRoutes.routes);
    router.use("/estadoActivo", EstadoActivoRoutes.routes);
    router.use("/estadoOrden", EstadoOrdenRoutes.routes);
    router.use("/categoriaActivo", CategoriaActivoRoutes.routes);
    router.use("/claseMantenimiento", ClaseMantenimientoRoutes.routes);
    router.use("/prioridad", PrioridadRoutes.routes);
    router.use("/nivelCriticidad", NivelCriticidadRoutes.routes);
    router.use("/tipoCombustible", TipoCombustibleRoutes.routes);
    router.use("/unidadMedida", UnidadMedidaRoutes.routes);
    router.use("/nivelCertificacion", NivelCertificacionRoutes.routes);
    router.use("/marca", MarcaRoutes.routes);
    router.use("/modelo", ModeloRoutes.routes);
    router.use("/especialidad", EspecialidadRoutes.routes);
    router.use("/tipoMantenimiento", TipoMantenimientoRoutes.routes);
    router.use("/tecnico", TecnicoRoutes.routes);
    router.use("/repuesto", RepuestoRoutes.routes);
    router.use("/proveedor", ProveedorRoutes.routes);
    router.use("/usuario", UsuarioRoutes.routes);
    router.use("/orden", OrdenRoutes.routes);
    router.use("/historialEstadoActivo", HistorialEstadoActivoRoutes.routes);
    router.use("/historialEstadoOrden", HistorialEstadoOrdenRoutes.routes);
    router.use("/images", ImageRoutes.routes);
    return router;
  }
}

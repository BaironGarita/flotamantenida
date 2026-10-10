import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";
import { usuarioPublicoSelect } from "../utils/usuario-select";

const ordenResumenInclude = {
  activo: { select: { id: true, codigo: true, nombre: true, placa: true } },
  tipoMantenimiento: { include: { clase: true, especialidad: true } },
  prioridad: true,
  estadoOrden: true,
  usuarioSolicitante: { select: usuarioPublicoSelect },
} satisfies Prisma.OrdenMantenimientoInclude;

const ordenDetalleInclude = {
  ...ordenResumenInclude,
  activo: {
    include: {
      modelo: { include: { marca: true } },
      categoria: true,
      tipoCombustible: true,
      nivelCriticidad: true,
      estadoActivo: true,
    },
  },
  tecnicos: {
    include: {
      tecnico: {
        include: { especialidades: { include: { especialidad: true, nivelCertificacion: true } } },
      },
    },
    orderBy: { fechaAsignacion: "asc" },
  },
  repuestos: {
    include: { repuesto: { include: { unidadMedida: true } }, proveedor: true },
    orderBy: [{ fechaRegistro: "asc" }, { id: "asc" }],
  },
  historial: {
    include: { estadoAnterior: true, estadoNuevo: true, usuario: { select: usuarioPublicoSelect } },
    orderBy: [{ fechaCambio: "asc" }, { id: "asc" }],
  },
  historialActivos: {
    include: { estadoAnterior: true, estadoNuevo: true, usuario: { select: usuarioPublicoSelect } },
    orderBy: [{ fechaCambio: "asc" }, { id: "asc" }],
  },
} satisfies Prisma.OrdenMantenimientoInclude;

export const ordenService = {
  async listar() {
    return prisma.ordenMantenimiento.findMany({
      include: ordenResumenInclude,
      orderBy: [{ fechaSolicitud: "desc" }, { id: "desc" }],
    });
  },

  async listarPorUsuario(usuarioId: number) {
    return prisma.ordenMantenimiento.findMany({
      where: { usuarioSolicitanteId: usuarioId },
      include: ordenResumenInclude,
      orderBy: [{ fechaSolicitud: "desc" }, { id: "desc" }],
    });
  },

  async obtenerPorId(id: number) {
    return prisma.ordenMantenimiento.findUnique({ where: { id }, include: ordenDetalleInclude });
  },
};

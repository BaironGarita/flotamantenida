import { omitUndefined } from "../utils/omit-undefined";
import { AppError } from "../utils/app-error";
import type { CreateOrdenDto, UpdateOrdenDto } from "../dtos/orden.dto";
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
  async listar(activoId?: number) {
    const rows = await prisma.ordenMantenimiento.findMany({
      ...(activoId === undefined ? {} : { where: { activoId } }),
      include: ordenResumenInclude,
      orderBy: [{ fechaSolicitud: "desc" }, { id: "desc" }],
    });
    return rows.map(row => row.fechaSolicitud instanceof Date ? ({ ...row, diasTranscurridos: this.diasTranscurridos(row.fechaSolicitud) }) : row);
  },

  async listarPorUsuario(usuarioId: number) {
    return prisma.ordenMantenimiento.findMany({
      where: { usuarioSolicitanteId: usuarioId },
      include: ordenResumenInclude,
      orderBy: [{ fechaSolicitud: "desc" }, { id: "desc" }],
    });
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.ordenMantenimiento.findUnique({ where: { id }, include: ordenDetalleInclude });
    if (!resultado) throw AppError.notFound("Orden de mantenimiento no encontrada");
    return resultado.fechaSolicitud instanceof Date ? { ...resultado, diasTranscurridos: this.diasTranscurridos(resultado.fechaSolicitud) } : resultado;
  },
  async validarReferencias(data: UpdateOrdenDto) {
    if (data.activoId !== undefined) {
      const activo = await prisma.activo.findUnique({ where: { id: data.activoId } });
      if (!activo) throw AppError.badRequest("El vehículo indicado no existe");
      if (activo.estadoActivoId === 4) throw AppError.badRequest("El vehículo está dado de baja");
    }
    if (data.usuarioSolicitanteId !== undefined) {
      const usuario = await prisma.usuario.findUnique({ where: { id: data.usuarioSolicitanteId } });
      if (!usuario || !usuario.activo) throw AppError.badRequest("El solicitante no existe o está inactivo");
    }
    if (data.tipoMantenimientoId !== undefined) {
      const tipo = await prisma.tipoMantenimiento.findUnique({ where: { id: data.tipoMantenimientoId } });
      if (!tipo || !tipo.activo) throw AppError.badRequest("El tipo de mantenimiento no existe o está inactivo");
    }
    if (data.prioridadId != null && !await prisma.prioridad.findUnique({ where: { id: data.prioridadId } })) {
      throw AppError.badRequest("La prioridad indicada no existe");
    }
  },
  async crear(data: CreateOrdenDto) {
    await this.validarReferencias(data);
    const solicitada = await prisma.estadoOrden.findUnique({ where: { id: 1 } });
    if (!solicitada || solicitada.nombre !== "Solicitada") throw AppError.internalServer();
    return prisma.ordenMantenimiento.create({ data: {
      ...omitUndefined(data), estadoOrdenId: 1, fechaProgramada: data.fechaProgramada ? new Date(data.fechaProgramada) : null,
    }, include: ordenDetalleInclude });
  },
  async actualizar(id: number, data: UpdateOrdenDto) {
    const current = await this.obtenerPorId(id);
    if (!current) throw AppError.notFound("Orden de mantenimiento no encontrada");
    if (current.estadoOrdenId !== 1) throw AppError.conflict("Solo se pueden editar solicitudes en estado Solicitada");
    await this.validarReferencias(data);
    const { fechaProgramada, ...rest } = data;
    // Edición de la solicitud, sin transiciones, repuestos ni asignación de técnicos.
    return prisma.ordenMantenimiento.update({ where: { id }, data: {
      ...omitUndefined(rest),
      ...(fechaProgramada !== undefined ? { fechaProgramada: fechaProgramada ? new Date(fechaProgramada) : null } : {}),
    }, include: ordenDetalleInclude });
  },

  diasTranscurridos(fechaSolicitud: Date) {
    return Math.max(0, Math.floor((Date.now() - fechaSolicitud.getTime()) / 86400000));
  },
};

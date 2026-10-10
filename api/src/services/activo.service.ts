import { omitUndefined } from "../utils/omit-undefined";
import { AppError } from "../utils/app-error";
import type { CreateActivoDto, UpdateActivoDto } from "../dtos/activo.dto";
import { prisma } from "../config/prisma";
import { usuarioPublicoSelect } from "../utils/usuario-select";

export const activoService = {
  async listar(skip: number, limit: number) {
    const [data, total] = await prisma.$transaction([prisma.activo.findMany({
      skip, take: limit,
      select: {
        id: true,
        codigo: true,
        nombre: true,
        placa: true,
        anio: true,
        kilometrajeActual: true,
        imagenUrl: true,
        modelo: { include: { marca: true } },
        categoria: true,
        estadoActivo: true,
      },
      orderBy: [{ fechaCreacion: "desc" }, { id: "desc" }],
    }), prisma.activo.count()]);
    return { data, total };
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.activo.findUnique({
      where: { id },
      include: {
        modelo: { include: { marca: true } },
        tipoCombustible: true,
        categoria: true,
        ordenes: {
          include: { estadoOrden: true, tipoMantenimiento: true, prioridad: true },
          orderBy: [{ fechaSolicitud: "desc" }, { id: "desc" }],
        },
        historial: {
          include: { estadoAnterior: true, estadoNuevo: true, usuario: { select: usuarioPublicoSelect } },
          orderBy: [{ fechaCambio: "asc" }, { id: "asc" }],
        },
        nivelCriticidad: true,
        estadoActivo: true,
      },
    });
    if (!resultado) throw AppError.notFound("Vehículo no encontrado");
    return resultado;
  },
  async validarReferencias(data: UpdateActivoDto) {
    const references = [
      [data.modeloId, (id: number) => prisma.modelo.findUnique({ where: { id } }), "El modelo indicado no existe"],
      [data.tipoCombustibleId, (id: number) => prisma.tipoCombustible.findUnique({ where: { id } }), "El combustible indicado no existe"],
      [data.categoriaId, (id: number) => prisma.categoriaActivo.findUnique({ where: { id } }), "La categoría indicada no existe"],
      [data.nivelCriticidadId, (id: number) => prisma.nivelCriticidad.findUnique({ where: { id } }), "La criticidad indicada no existe"],
      [data.estadoActivoId, (id: number) => prisma.estadoActivo.findUnique({ where: { id } }), "El estado indicado no existe"],
    ] as const;
    for (const [id, lookup, message] of references) {
      if (id !== undefined && !await lookup(id)) {
        throw AppError.badRequest(message);
      }
    }
  },
  async crear(data: CreateActivoDto) {
    await this.validarReferencias({ ...omitUndefined(data), estadoActivoId: data.estadoActivoId ?? 1 });
    const created = await prisma.activo.create({ data: {
      ...omitUndefined(data), fechaAdquisicion: new Date(data.fechaAdquisicion), estadoActivoId: data.estadoActivoId ?? 1,
    } });
    return this.obtenerPorId(created.id);
  },
  async actualizar(id: number, data: UpdateActivoDto) {
    const current = await this.obtenerPorId(id);
    if (!current) throw AppError.notFound("Vehículo no encontrado");
    await this.validarReferencias(data);
    if ((data.kilometrajeActual ?? current.kilometrajeActual) < (data.kilometrajeRegistro ?? current.kilometrajeRegistro)) {
      throw AppError.badRequest("El kilometraje actual no puede ser menor al de registro");
    }
    // El estado ligado a órdenes se gestiona en el avance del ciclo de mantenimiento.
    if (data.estadoActivoId !== undefined && data.estadoActivoId !== current.estadoActivoId) {
      const abiertas = await prisma.ordenMantenimiento.count({
        where: { activoId: id, estadoOrdenId: { notIn: [4, 7, 8] } },
      });
      if (abiertas) throw AppError.conflict("No se puede cambiar el estado de un vehículo con órdenes abiertas");
    }
    const { fechaAdquisicion, ...rest } = data;
    await prisma.activo.update({ where: { id }, data: {
      ...omitUndefined(rest), ...(fechaAdquisicion !== undefined ? { fechaAdquisicion: new Date(fechaAdquisicion) } : {}),
    } });
    return this.obtenerPorId(id);
  },
};

import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";
import type { CreateCategoriaActivoDto, UpdateCategoriaActivoDto } from "../dtos/catalog-crud.dto";
import { omitUndefined } from "../utils/omit-undefined";

export const categoriaActivoService = {
  withCalculated<T extends { _count?: { activos: number } }>(row: T) {
    const { _count, ...data } = row;
    return _count ? { ...data, cantidadActivos: _count.activos } : data;
  },

  async listar() {
    const rows = await prisma.categoriaActivo.findMany({
      include: { _count: { select: { activos: true } } },
      orderBy: { nombre: "asc" },
    });
    return rows.map(row => this.withCalculated(row));
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.categoriaActivo.findUnique({
      where: { id },
      include: { activos: { select: { id: true, codigo: true, nombre: true, estadoActivo: true } }, _count: { select: { activos: true } } },
    });
    if (!resultado) throw AppError.notFound("Categoría de vehículo no encontrada");
    return this.withCalculated(resultado);
  },

  async crear(data: CreateCategoriaActivoDto) {
    const row = await prisma.categoriaActivo.create({ data: omitUndefined(data), include: { _count: { select: { activos: true } } } });
    return this.withCalculated(row);
  },

  async actualizar(id: number, data: UpdateCategoriaActivoDto) {
    const category = await prisma.categoriaActivo.findUnique({ where: { id }, include: { _count: { select: { activos: true } } } });
    if (!category) throw AppError.notFound("Categoría de vehículo no encontrada");
    if (data.activo === false && category._count.activos > 0) {
      throw AppError.conflict("No se puede desactivar una categoría con activos asociados");
    }
    const row = await prisma.categoriaActivo.update({ where: { id }, data: omitUndefined(data), include: { _count: { select: { activos: true } } } });
    return this.withCalculated(row);
  },

  async desactivar(id: number) {
    const category = await prisma.categoriaActivo.findUnique({ where: { id }, include: { _count: { select: { activos: true } } } });
    if (!category) throw AppError.notFound("Categoría de vehículo no encontrada");
    if (category._count.activos > 0) throw AppError.conflict("No se puede desactivar una categoría con activos asociados");
    return prisma.categoriaActivo.update({ where: { id }, data: { activo: false } });
  },
};

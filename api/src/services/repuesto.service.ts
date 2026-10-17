import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";
import type { AssociateRepuestoProveedorDto, CreateRepuestoDto, UpdateRepuestoDto } from "../dtos/catalog-crud.dto";
import { omitUndefined } from "../utils/omit-undefined";

export const repuestoService = {
  async listar(stockBajo = false) {
    const rows = await prisma.repuesto.findMany({
      include: { unidadMedida: true, _count: { select: { proveedores: true } } },
      orderBy: [{ nombre: "asc" }, { id: "asc" }],
    });
    return rows
      .filter(row => !stockBajo || row.stockActual < row.stockMinimo)
      .map(({ _count, ...row }) => this.withCalculated(row, _count?.proveedores ?? 0));
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.repuesto.findUnique({
      where: { id },
      include: { unidadMedida: true, proveedores: { include: { proveedor: true }, orderBy: { precio: "asc" } } },
    });
    if (!resultado) throw AppError.notFound("Repuesto no encontrado");
    return this.withCalculated(resultado, resultado.proveedores?.length ?? 0);
  },

  withCalculated<T extends { stockActual?: number; stockMinimo?: number }>(row: T, cantidadProveedores: number) {
    if (row.stockActual === undefined || row.stockMinimo === undefined) return row;
    return { ...row, stockBajo: row.stockActual < row.stockMinimo, faltanteStock: Math.max(row.stockMinimo - row.stockActual, 0), cantidadProveedores };
  },

  async crear(data: CreateRepuestoDto) {
    const created = await prisma.repuesto.create({ data: omitUndefined({ stockActual: 0, stockMinimo: 0, ...data }), include: { unidadMedida: true } });
    return this.obtenerPorId(created.id);
  },

  async actualizar(id: number, data: UpdateRepuestoDto) {
    await this.obtenerPorId(id);
    await prisma.repuesto.update({ where: { id }, data: omitUndefined(data) });
    return this.obtenerPorId(id);
  },

  async asociarProveedor(repuestoId: number, data: AssociateRepuestoProveedorDto) {
    await this.obtenerPorId(repuestoId);
    if (!await prisma.proveedor.findUnique({ where: { id: data.proveedorId } })) throw AppError.notFound("Proveedor no encontrado");
    return prisma.repuestoProveedor.create({ data: { repuestoId, proveedorId: data.proveedorId, precio: data.precio, tiempoEntregaDias: data.tiempoEntregaDias }, include: { proveedor: true } });
  },

  async actualizarProveedor(repuestoId: number, proveedorId: number, data: Omit<AssociateRepuestoProveedorDto, "proveedorId">) {
    const relation = await prisma.repuestoProveedor.findUnique({ where: { repuestoId_proveedorId: { repuestoId, proveedorId } } });
    if (!relation) throw AppError.notFound("La relación con el proveedor no existe");
    return prisma.repuestoProveedor.update({ where: { repuestoId_proveedorId: { repuestoId, proveedorId } }, data, include: { proveedor: true } });
  },
};

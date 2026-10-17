import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";
import type { CreateProveedorDto, UpdateProveedorDto } from "../dtos/catalog-crud.dto";
import { omitUndefined } from "../utils/omit-undefined";

export const proveedorService = {
  async listar() {
    return prisma.proveedor.findMany({

      orderBy: [{ nombre: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.proveedor.findUnique({
      where: { id },
      include: { repuestos: { include: { repuesto: { include: { unidadMedida: true } } } } },
    });
    if (!resultado) throw AppError.notFound("Proveedor no encontrado");
    return resultado;
  },

  async crear(data: CreateProveedorDto) {
    return prisma.proveedor.create({ data: omitUndefined(data) });
  },

  async actualizar(id: number, data: UpdateProveedorDto) {
    await this.obtenerPorId(id);
    return prisma.proveedor.update({ where: { id }, data: omitUndefined(data) });
  },
};

import { prisma } from "../config/prisma";

export const repuestoService = {
  async listar() {
    return prisma.repuesto.findMany({
      include: { unidadMedida: true },
      orderBy: [{ nombre: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    return prisma.repuesto.findUnique({
      where: { id },
      include: { unidadMedida: true, proveedores: { include: { proveedor: true }, orderBy: { precio: "asc" } } },
    });
  },
};

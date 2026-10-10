import { prisma } from "../config/prisma";

export const proveedorService = {
  async listar() {
    return prisma.proveedor.findMany({

      orderBy: [{ nombre: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    return prisma.proveedor.findUnique({
      where: { id },
      include: { repuestos: { include: { repuesto: { include: { unidadMedida: true } } } } },
    });
  },
};

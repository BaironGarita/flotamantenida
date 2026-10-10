import { prisma } from "../config/prisma";

export const tipoMantenimientoService = {
  async listar() {
    return prisma.tipoMantenimiento.findMany({
      include: { clase: true, especialidad: true },
      orderBy: [{ nombre: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    return prisma.tipoMantenimiento.findUnique({
      where: { id },
      include: { clase: true, especialidad: true },
    });
  },
};

import { prisma } from "../config/prisma";

export const claseMantenimientoService = {
  async listar() {
    return prisma.claseMantenimiento.findMany({

      orderBy: [{ id: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    return prisma.claseMantenimiento.findUnique({
      where: { id },

    });
  },
};

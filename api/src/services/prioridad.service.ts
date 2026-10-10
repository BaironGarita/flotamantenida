import { prisma } from "../config/prisma";

export const prioridadService = {
  async listar() {
    return prisma.prioridad.findMany({

      orderBy: [{ nivel: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    return prisma.prioridad.findUnique({
      where: { id },

    });
  },
};

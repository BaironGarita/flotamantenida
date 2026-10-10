import { prisma } from "../config/prisma";

export const estadoOrdenService = {
  async listar() {
    return prisma.estadoOrden.findMany({
      orderBy: { id: "asc" },
    });
  },

  async obtenerPorId(id: number) {
    return prisma.estadoOrden.findUnique({ where: { id } });
  },
};

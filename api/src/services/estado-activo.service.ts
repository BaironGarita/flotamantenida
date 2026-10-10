import { prisma } from "../config/prisma";

export const estadoActivoService = {
  async listar() {
    return prisma.estadoActivo.findMany({
      orderBy: { id: "asc" },
    });
  },

  async obtenerPorId(id: number) {
    return prisma.estadoActivo.findUnique({ where: { id } });
  },
};

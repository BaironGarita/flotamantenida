import { prisma } from "../config/prisma";

export const modeloService = {
  async listar() {
    return prisma.modelo.findMany({
      include: { marca: true },
      orderBy: [{ nombre: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    return prisma.modelo.findUnique({
      where: { id },
      include: { marca: true },
    });
  },
};

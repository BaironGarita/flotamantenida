import { prisma } from "../config/prisma";

export const marcaService = {
  async listar() {
    return prisma.marca.findMany({

      orderBy: [{ nombre: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    return prisma.marca.findUnique({
      where: { id },
      include: { modelos: { orderBy: { nombre: "asc" } } },
    });
  },
};

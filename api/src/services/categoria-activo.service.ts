import { prisma } from "../config/prisma";

export const categoriaActivoService = {
  async listar() {
    return prisma.categoriaActivo.findMany({
      orderBy: { nombre: "asc" },
    });
  },

  async obtenerPorId(id: number) {
    return prisma.categoriaActivo.findUnique({ where: { id } });
  },
};

import { prisma } from "../config/prisma";

export const rolService = {
  async listar() {
    return prisma.rol.findMany({
      orderBy: { nombre: "asc" },
    });
  },

  async obtenerPorId(id: number) {
    return prisma.rol.findUnique({ where: { id } });
  },
};

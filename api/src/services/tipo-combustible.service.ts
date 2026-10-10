import { prisma } from "../config/prisma";

export const tipoCombustibleService = {
  async listar() {
    return prisma.tipoCombustible.findMany({

      orderBy: [{ nombre: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    return prisma.tipoCombustible.findUnique({
      where: { id },

    });
  },
};

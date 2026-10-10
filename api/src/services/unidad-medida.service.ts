import { prisma } from "../config/prisma";

export const unidadMedidaService = {
  async listar() {
    return prisma.unidadMedida.findMany({

      orderBy: [{ nombre: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    return prisma.unidadMedida.findUnique({
      where: { id },

    });
  },
};

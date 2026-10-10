import { prisma } from "../config/prisma";

export const nivelCriticidadService = {
  async listar() {
    return prisma.nivelCriticidad.findMany({

      orderBy: [{ id: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    return prisma.nivelCriticidad.findUnique({
      where: { id },

    });
  },
};

import { prisma } from "../config/prisma";

export const nivelCertificacionService = {
  async listar() {
    return prisma.nivelCertificacion.findMany({

      orderBy: [{ nivel: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    return prisma.nivelCertificacion.findUnique({
      where: { id },

    });
  },
};

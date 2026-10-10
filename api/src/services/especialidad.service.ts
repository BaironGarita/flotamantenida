import { prisma } from "../config/prisma";

export const especialidadService = {
  async listar() {
    return prisma.especialidad.findMany({

      orderBy: [{ nombre: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    return prisma.especialidad.findUnique({
      where: { id },
      include: { tecnicos: { include: { tecnico: true, nivelCertificacion: true } } },
    });
  },
};

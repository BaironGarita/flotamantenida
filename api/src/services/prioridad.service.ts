import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";

export const prioridadService = {
  async listar() {
    return prisma.prioridad.findMany({

      orderBy: [{ nivel: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.prioridad.findUnique({
      where: { id },

    });
    if (!resultado) throw AppError.notFound("Prioridad no encontrada");
    return resultado;
  },
};

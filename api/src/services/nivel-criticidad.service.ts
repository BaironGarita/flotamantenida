import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";

export const nivelCriticidadService = {
  async listar() {
    return prisma.nivelCriticidad.findMany({

      orderBy: [{ id: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.nivelCriticidad.findUnique({
      where: { id },

    });
    if (!resultado) throw AppError.notFound("Nivel de criticidad no encontrado");
    return resultado;
  },
};

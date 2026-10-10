import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";

export const nivelCertificacionService = {
  async listar() {
    return prisma.nivelCertificacion.findMany({

      orderBy: [{ nivel: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.nivelCertificacion.findUnique({
      where: { id },

    });
    if (!resultado) throw AppError.notFound("Nivel de certificación no encontrado");
    return resultado;
  },
};

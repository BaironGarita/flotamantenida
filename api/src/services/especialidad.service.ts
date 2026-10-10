import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";

export const especialidadService = {
  async listar() {
    return prisma.especialidad.findMany({

      orderBy: [{ nombre: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.especialidad.findUnique({
      where: { id },
      include: { tecnicos: { include: { tecnico: true, nivelCertificacion: true } } },
    });
    if (!resultado) throw AppError.notFound("Especialidad no encontrada");
    return resultado;
  },
};

import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";

export const estadoActivoService = {
  async listar() {
    return prisma.estadoActivo.findMany({
      orderBy: { id: "asc" },
    });
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.estadoActivo.findUnique({ where: { id } });
    if (!resultado) throw AppError.notFound("Estado de vehículo no encontrado");
    return resultado;
  },
};

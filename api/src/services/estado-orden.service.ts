import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";

export const estadoOrdenService = {
  async listar() {
    return prisma.estadoOrden.findMany({
      orderBy: { id: "asc" },
    });
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.estadoOrden.findUnique({ where: { id } });
    if (!resultado) throw AppError.notFound("Estado de orden no encontrado");
    return resultado;
  },
};

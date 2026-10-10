import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";

export const categoriaActivoService = {
  async listar() {
    return prisma.categoriaActivo.findMany({
      orderBy: { nombre: "asc" },
    });
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.categoriaActivo.findUnique({ where: { id } });
    if (!resultado) throw AppError.notFound("Categoría de vehículo no encontrada");
    return resultado;
  },
};

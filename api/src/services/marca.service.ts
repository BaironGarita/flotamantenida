import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";

export const marcaService = {
  async listar() {
    return prisma.marca.findMany({

      orderBy: [{ nombre: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.marca.findUnique({
      where: { id },
      include: { modelos: { orderBy: { nombre: "asc" } } },
    });
    if (!resultado) throw AppError.notFound("Marca no encontrada");
    return resultado;
  },
};

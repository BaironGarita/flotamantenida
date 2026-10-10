import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";

export const modeloService = {
  async listar() {
    return prisma.modelo.findMany({
      include: { marca: true },
      orderBy: [{ nombre: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.modelo.findUnique({
      where: { id },
      include: { marca: true },
    });
    if (!resultado) throw AppError.notFound("Modelo no encontrado");
    return resultado;
  },
};

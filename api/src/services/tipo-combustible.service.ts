import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";

export const tipoCombustibleService = {
  async listar() {
    return prisma.tipoCombustible.findMany({

      orderBy: [{ nombre: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.tipoCombustible.findUnique({
      where: { id },

    });
    if (!resultado) throw AppError.notFound("Tipo de combustible no encontrado");
    return resultado;
  },
};

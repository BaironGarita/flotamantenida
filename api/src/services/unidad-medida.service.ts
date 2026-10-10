import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";

export const unidadMedidaService = {
  async listar() {
    return prisma.unidadMedida.findMany({

      orderBy: [{ nombre: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.unidadMedida.findUnique({
      where: { id },

    });
    if (!resultado) throw AppError.notFound("Unidad de medida no encontrada");
    return resultado;
  },
};

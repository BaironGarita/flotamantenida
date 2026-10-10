import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";

export const claseMantenimientoService = {
  async listar() {
    return prisma.claseMantenimiento.findMany({

      orderBy: [{ id: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.claseMantenimiento.findUnique({
      where: { id },

    });
    if (!resultado) throw AppError.notFound("Clase de mantenimiento no encontrada");
    return resultado;
  },
};

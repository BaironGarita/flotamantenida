import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";

export const tipoMantenimientoService = {
  async listar() {
    return prisma.tipoMantenimiento.findMany({
      include: { clase: true, especialidad: true },
      orderBy: [{ nombre: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.tipoMantenimiento.findUnique({
      where: { id },
      include: { clase: true, especialidad: true },
    });
    if (!resultado) throw AppError.notFound("Tipo de mantenimiento no encontrado");
    return resultado;
  },
};

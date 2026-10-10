import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";

export const rolService = {
  async listar() {
    return prisma.rol.findMany({
      orderBy: { nombre: "asc" },
    });
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.rol.findUnique({ where: { id } });
    if (!resultado) throw AppError.notFound("Rol no encontrado");
    return resultado;
  },
};

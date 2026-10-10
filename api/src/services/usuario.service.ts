import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";
import { usuarioPublicoSelect } from "../utils/usuario-select";

export const usuarioService = {
  async listar() {
    return prisma.usuario.findMany({
      select: usuarioPublicoSelect,
      orderBy: [{ nombreCompleto: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.usuario.findUnique({
      where: { id },
      select: usuarioPublicoSelect,
    });
    if (!resultado) throw AppError.notFound("Usuario no encontrado");
    return resultado;
  },
};

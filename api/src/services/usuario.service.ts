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
    return prisma.usuario.findUnique({
      where: { id },
      select: usuarioPublicoSelect,
    });
  },
};

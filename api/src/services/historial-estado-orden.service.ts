import { prisma } from "../config/prisma";
import { usuarioPublicoSelect } from "../utils/usuario-select";

export const historialEstadoOrdenService = {
  async listar() {
    return prisma.historialEstadoOrden.findMany({
      include: { orden: { select: { id: true, codigo: true } }, estadoAnterior: true, estadoNuevo: true, usuario: { select: usuarioPublicoSelect } },
      orderBy: [{ fechaCambio: "desc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    return prisma.historialEstadoOrden.findUnique({
      where: { id },
      include: { orden: { select: { id: true, codigo: true } }, estadoAnterior: true, estadoNuevo: true, usuario: { select: usuarioPublicoSelect } },
    });
  },
};

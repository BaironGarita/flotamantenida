import { AppError } from "../utils/app-error";
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
    const resultado = await prisma.historialEstadoOrden.findUnique({
      where: { id },
      include: { orden: { select: { id: true, codigo: true } }, estadoAnterior: true, estadoNuevo: true, usuario: { select: usuarioPublicoSelect } },
    });
    if (!resultado) throw AppError.notFound("Historial de orden no encontrado");
    return resultado;
  },
};

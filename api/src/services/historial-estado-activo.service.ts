import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";
import { usuarioPublicoSelect } from "../utils/usuario-select";

export const historialEstadoActivoService = {
  async listar() {
    return prisma.historialEstadoActivo.findMany({
      include: { activo: { select: { id: true, codigo: true, nombre: true, placa: true } }, estadoAnterior: true, estadoNuevo: true, usuario: { select: usuarioPublicoSelect }, orden: { select: { id: true, codigo: true } } },
      orderBy: [{ fechaCambio: "desc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.historialEstadoActivo.findUnique({
      where: { id },
      include: { activo: { select: { id: true, codigo: true, nombre: true, placa: true } }, estadoAnterior: true, estadoNuevo: true, usuario: { select: usuarioPublicoSelect }, orden: { select: { id: true, codigo: true } } },
    });
    if (!resultado) throw AppError.notFound("Historial de vehículo no encontrado");
    return resultado;
  },
};

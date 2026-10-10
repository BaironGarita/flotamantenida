import { prisma } from "../config/prisma";
import { usuarioPublicoSelect } from "../utils/usuario-select";

export const activoService = {
  async listar() {
    return prisma.activo.findMany({
      select: {
        id: true,
        codigo: true,
        nombre: true,
        placa: true,
        anio: true,
        kilometrajeActual: true,
        imagenUrl: true,
        modelo: { include: { marca: true } },
        categoria: true,
        estadoActivo: true,
      },
      orderBy: [{ fechaCreacion: "desc" }, { id: "desc" }],
    });
  },

  async obtenerPorId(id: number) {
    return prisma.activo.findUnique({
      where: { id },
      include: {
        modelo: { include: { marca: true } },
        tipoCombustible: true,
        categoria: true,
        ordenes: {
          include: { estadoOrden: true, tipoMantenimiento: true, prioridad: true },
          orderBy: [{ fechaSolicitud: "desc" }, { id: "desc" }],
        },
        historial: {
          include: { estadoAnterior: true, estadoNuevo: true, usuario: { select: usuarioPublicoSelect } },
          orderBy: [{ fechaCambio: "asc" }, { id: "asc" }],
        },
        nivelCriticidad: true,
        estadoActivo: true,
      },
    });
  },
};

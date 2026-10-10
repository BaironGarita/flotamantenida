import { prisma } from "../config/prisma";

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
        nivelCriticidad: true,
        estadoActivo: true,
      },
    });
  },
};

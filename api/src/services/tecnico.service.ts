import { prisma } from "../config/prisma";

export const tecnicoService = {
  async listar() {
    return prisma.tecnico.findMany({
      include: { especialidades: { include: { especialidad: true, nivelCertificacion: true } } },
      orderBy: [{ nombreCompleto: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    return prisma.tecnico.findUnique({
      where: { id },
      include: { especialidades: { include: { especialidad: true, nivelCertificacion: true } }, asignaciones: { include: { orden: true }, orderBy: { fechaAsignacion: "desc" } } },
    });
  },
};

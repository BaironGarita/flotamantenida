import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";
import type { CreateEspecialidadDto, UpdateEspecialidadDto } from "../dtos/catalog-crud.dto";
import { omitUndefined } from "../utils/omit-undefined";

export const especialidadService = {
  async listar() {
    const rows = await prisma.especialidad.findMany({
      include: { _count: { select: { tecnicos: true } } },
      orderBy: [{ nombre: "asc" }, { id: "asc" }],
    });
    return rows.map(({ _count, ...row }) => _count ? ({ ...row, cantidadTecnicos: _count.tecnicos }) : row);
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.especialidad.findUnique({
      where: { id },
      include: { tecnicos: { include: { tecnico: true, nivelCertificacion: true } } },
    });
    if (!resultado) throw AppError.notFound("Especialidad no encontrada");
    return resultado;
  },

  async crear(data: CreateEspecialidadDto) {
    return prisma.especialidad.create({ data: omitUndefined(data) });
  },

  async actualizar(id: number, data: UpdateEspecialidadDto) {
    await this.obtenerPorId(id);
    return prisma.especialidad.update({ where: { id }, data: omitUndefined(data) });
  },
};

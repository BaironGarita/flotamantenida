import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";
import type { AssociateTecnicoEspecialidadDto, CreateTecnicoDto, UpdateTecnicoDto } from "../dtos/catalog-crud.dto";
import { omitUndefined } from "../utils/omit-undefined";

import { elapsedYears } from "../utils/elapsed-years";

function withCalculated<T extends { especialidades?: { fechaCertificacion: Date }[] }>(row: T) {
  if (!row.especialidades) return row;
  return { ...row, cantidadEspecialidades: row.especialidades.length,
    especialidades: row.especialidades.map(relation => ({ ...relation, antiguedadAnios: elapsedYears(relation.fechaCertificacion) })),
  };
}

export const tecnicoService = {
  async listar(especialidadId?: number, disponible?: boolean) {
    const rows = await prisma.tecnico.findMany({
      where: {
        ...(disponible === undefined ? {} : { disponible }),
        ...(especialidadId === undefined ? {} : { especialidades: { some: { especialidadId } } }),
      },
      include: { especialidades: { include: { especialidad: true, nivelCertificacion: true } } },
      orderBy: [{ nombreCompleto: "asc" }, { id: "asc" }],
    });
    return rows.map(row => withCalculated(row));
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.tecnico.findUnique({
      where: { id },
      include: { especialidades: { include: { especialidad: true, nivelCertificacion: true } }, asignaciones: { include: { orden: true }, orderBy: { fechaAsignacion: "desc" } } },
    });
    if (!resultado) throw AppError.notFound("Técnico no encontrado");
    return withCalculated(resultado);
  },

  async crear(data: CreateTecnicoDto) {
    const created = await prisma.tecnico.create({ data: omitUndefined(data) });
    return this.obtenerPorId(created.id);
  },

  async actualizar(id: number, data: UpdateTecnicoDto) {
    await this.obtenerPorId(id);
    await prisma.tecnico.update({ where: { id }, data: omitUndefined(data) });
    return this.obtenerPorId(id);
  },

  async asociarEspecialidad(tecnicoId: number, data: AssociateTecnicoEspecialidadDto) {
    await this.obtenerPorId(tecnicoId);
    if (!await prisma.especialidad.findUnique({ where: { id: data.especialidadId } })) throw AppError.notFound("Especialidad no encontrada");
    if (!await prisma.nivelCertificacion.findUnique({ where: { id: data.nivelCertificacionId } })) throw AppError.notFound("Nivel de certificación no encontrado");
    const existing = await prisma.tecnicoEspecialidad.findUnique({ where: { tecnicoId_especialidadId: { tecnicoId, especialidadId: data.especialidadId } } });
    if (existing) throw AppError.conflict("La especialidad ya está asociada al técnico");
    return prisma.tecnicoEspecialidad.create({ data: { tecnicoId, especialidadId: data.especialidadId, nivelCertificacionId: data.nivelCertificacionId, fechaCertificacion: new Date(data.fechaCertificacion) }, include: { especialidad: true, nivelCertificacion: true } });
  },

  async desasociarEspecialidad(tecnicoId: number, especialidadId: number) {
    const relation = await prisma.tecnicoEspecialidad.findUnique({ where: { tecnicoId_especialidadId: { tecnicoId, especialidadId } } });
    if (!relation) throw AppError.notFound("La especialidad no está asociada al técnico");
    await prisma.tecnicoEspecialidad.delete({ where: { tecnicoId_especialidadId: { tecnicoId, especialidadId } } });
  },
};

import { z } from "zod";

const id = z.number({ error: "Debe ser un ID numérico" }).int().positive().max(2147483647);
const text = (min: number, max: number) => z.string().trim().min(min).max(max);
const money = (max: number) => z.number().finite().min(0).max(max).multipleOf(0.01, "Solo se permiten dos decimales");
const date = z.iso.date();

export const createCategoriaActivoSchema = z.object({
  nombre: text(2, 100),
  descripcion: text(0, 255).nullable().optional(),
  intervaloKm: z.number().int().min(0).max(4294967295),
  margenAlertaKm: z.number().int().min(0).max(4294967295),
  activo: z.boolean().optional(),
}).strict();
export const updateCategoriaActivoSchema = createCategoriaActivoSchema.partial().refine(value => Object.keys(value).length > 0, "Debe enviar al menos un campo para actualizar");

export const createTecnicoSchema = z.object({
  identificacion: text(1, 20),
  nombreCompleto: text(3, 150),
  telefono: text(3, 30),
  correo: z.email().max(150),
  tarifaHora: money(99999999.99),
  disponible: z.boolean().optional(),
  activo: z.boolean().optional(),
}).strict();
export const updateTecnicoSchema = createTecnicoSchema.partial().refine(value => Object.keys(value).length > 0, "Debe enviar al menos un campo para actualizar");

export const createEspecialidadSchema = z.object({
  nombre: text(2, 100),
  descripcion: text(0, 255).nullable().optional(),
  activo: z.boolean().optional(),
}).strict();
export const updateEspecialidadSchema = createEspecialidadSchema.partial().refine(value => Object.keys(value).length > 0, "Debe enviar al menos un campo para actualizar");

export const createRepuestoSchema = z.object({
  codigo: text(1, 20),
  nombre: text(2, 150),
  descripcion: text(0, 255).nullable().optional(),
  unidadMedidaId: id,
  stockActual: z.number().int().min(0).max(4294967295).optional(),
  stockMinimo: z.number().int().min(0).max(4294967295).optional(),
  activo: z.boolean().optional(),
}).strict();
export const updateRepuestoSchema = createRepuestoSchema.partial().refine(value => Object.keys(value).length > 0, "Debe enviar al menos un campo para actualizar");

export const createProveedorSchema = z.object({
  cedulaJuridica: text(1, 20),
  nombre: text(2, 150),
  contacto: text(2, 150),
  telefono: text(3, 30),
  correo: z.email().max(150),
  direccion: text(3, 255),
  condicionesGenerales: text(0, 500).nullable().optional(),
  activo: z.boolean().optional(),
}).strict();
export const updateProveedorSchema = createProveedorSchema.partial().refine(value => Object.keys(value).length > 0, "Debe enviar al menos un campo para actualizar");

export const associateTecnicoEspecialidadSchema = z.object({
  especialidadId: id,
  nivelCertificacionId: id,
  fechaCertificacion: date,
}).strict();

export const associateRepuestoProveedorSchema = z.object({
  proveedorId: id,
  precio: money(9999999999.99),
  tiempoEntregaDias: z.number().int().min(0).max(65535),
}).strict();

export const updateActivoEstadoSchema = z.object({
  estadoActivoId: id,
}).strict();

export type CreateCategoriaActivoDto = z.infer<typeof createCategoriaActivoSchema>;
export type UpdateCategoriaActivoDto = z.infer<typeof updateCategoriaActivoSchema>;
export type CreateTecnicoDto = z.infer<typeof createTecnicoSchema>;
export type UpdateTecnicoDto = z.infer<typeof updateTecnicoSchema>;
export type CreateEspecialidadDto = z.infer<typeof createEspecialidadSchema>;
export type UpdateEspecialidadDto = z.infer<typeof updateEspecialidadSchema>;
export type CreateRepuestoDto = z.infer<typeof createRepuestoSchema>;
export type UpdateRepuestoDto = z.infer<typeof updateRepuestoSchema>;
export type CreateProveedorDto = z.infer<typeof createProveedorSchema>;
export type UpdateProveedorDto = z.infer<typeof updateProveedorSchema>;
export type AssociateTecnicoEspecialidadDto = z.infer<typeof associateTecnicoEspecialidadSchema>;
export type AssociateRepuestoProveedorDto = z.infer<typeof associateRepuestoProveedorSchema>;

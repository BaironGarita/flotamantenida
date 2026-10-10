import { z } from "zod";
const id = z.number({ error: "Debe ser un ID numérico" }).int("Debe ser un número entero").positive("Debe ser mayor que cero").max(2147483647, "El ID está fuera del rango permitido");
const fields = z.object({
  codigo: z.string({ error: "Debe ser un texto" }).trim().regex(/^OM-\d{4}-\d{4}$/, "El código debe tener formato OM-2026-0001").max(20, "No puede superar 20 caracteres"),
  activoId: id,
  tipoMantenimientoId: id,
  prioridadId: id.nullable().optional(),
  usuarioSolicitanteId: id,
  motivo: z.string({ error: "Debe ser un texto" }).trim().min(10, "Debe tener al menos 10 caracteres").max(500, "No puede superar 500 caracteres"),
  kilometrajeAlSolicitar: z.number({ error: "Debe ser un número" }).int("Debe ser un número entero").min(0, "No se permiten valores negativos").max(4294967295, "El kilometraje está fuera del rango permitido"),
  fechaProgramada: z.iso.date({ error: "La fecha debe tener formato YYYY-MM-DD y ser válida" }).nullable().optional(),
  // El servidor fija Solicitada. No se acepta otro estado ni datos de ejecución.
  estadoOrdenId: z.literal(1, { error: "La solicitud debe crearse en estado Solicitada (1)" }).optional(),
}).strict();
export const createOrdenSchema = fields;
export const updateOrdenSchema = fields.partial().refine(
  data => Object.keys(data).length > 0, "Debe enviar al menos un campo para actualizar",
);
export type CreateOrdenDto = z.infer<typeof createOrdenSchema>;
export type UpdateOrdenDto = z.infer<typeof updateOrdenSchema>;

import { z } from "zod";

const id = z.number({ error: "Debe ser un ID numérico" }).int("Debe ser un número entero").positive("Debe ser mayor que cero").max(2147483647, "El ID está fuera del rango permitido");
const km = z.number({ error: "El kilometraje debe ser numérico" }).int("Debe ser un número entero").min(0, "No se permiten valores negativos").max(4294967295, "El kilometraje está fuera del rango permitido");
const fecha = z.iso.date({ error: "La fecha debe tener formato YYYY-MM-DD y ser válida" });
const activoFields = z.object({
  codigo: z.string({ error: "Debe ser un texto" }).trim().regex(/^[A-Z]{2,5}-\d{4}$/, "El código debe tener formato CPE-0001").max(20, "No puede superar 20 caracteres"),
  nombre: z.string({ error: "Debe ser un texto" }).trim().min(3, "Debe tener al menos 3 caracteres").max(100, "No puede superar 100 caracteres"),
  descripcion: z.string({ error: "Debe ser un texto" }).trim().min(10, "Debe tener al menos 10 caracteres").max(500, "No puede superar 500 caracteres").nullable().optional(),
  placa: z.string({ error: "Debe ser un texto" }).trim().min(3, "Debe tener al menos 3 caracteres").max(20, "No puede superar 20 caracteres"),
  modeloId: id,
  anio: z.number({ error: "Debe ser un número" }).int("Debe ser un número entero").min(1900, "El año no puede ser menor que 1900").max(new Date().getFullYear() + 1, "El año está fuera del rango permitido"),
  tipoCombustibleId: id,
  categoriaId: id,
  nivelCriticidadId: id,
  estadoActivoId: id.optional(),
  fechaAdquisicion: fecha,
  valorReferencia: z.number({ error: "El valor debe ser numérico" }).min(0, "No se permiten valores negativos").max(999999999999.99, "El valor supera el máximo permitido")
    .refine(value => Number(value.toFixed(2)) === value, "Solo se permiten dos decimales"),
  kilometrajeRegistro: km,
  kilometrajeActual: km,
  imagenUrl: z.string({ error: "Debe ser un texto" }).trim().regex(/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/i, "Guarde solo el nombre de la imagen JPG, PNG o WEBP").max(500).nullable().optional(),
}).strict();

export const createActivoSchema = activoFields.refine(
  data => data.kilometrajeActual >= data.kilometrajeRegistro,
  { message: "El kilometraje actual no puede ser menor al de registro", path: ["kilometrajeActual"] },
);
export const updateActivoSchema = activoFields.partial().refine(
  data => Object.keys(data).length > 0, "Debe enviar al menos un campo para actualizar",
).refine(data => data.kilometrajeActual === undefined || data.kilometrajeRegistro === undefined ||
  data.kilometrajeActual >= data.kilometrajeRegistro,
  { message: "El kilometraje actual no puede ser menor al de registro", path: ["kilometrajeActual"] });
export type CreateActivoDto = z.infer<typeof createActivoSchema>;
export type UpdateActivoDto = z.infer<typeof updateActivoSchema>;

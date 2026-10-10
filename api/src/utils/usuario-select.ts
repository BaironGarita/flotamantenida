import type { Prisma } from "../generated/prisma/client";

// Selección explícita compartida: las consultas no exponen contrasenaHash.
export const usuarioPublicoSelect = {
  id: true,
  rolId: true,
  nombreCompleto: true,
  correo: true,
  activo: true,
  fechaCreacion: true,
  ultimoAcceso: true,
  rol: true,
} satisfies Prisma.UsuarioSelect;

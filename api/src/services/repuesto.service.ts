import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";

export const repuestoService = {
  async listar() {
    return prisma.repuesto.findMany({
      include: { unidadMedida: true },
      orderBy: [{ nombre: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.repuesto.findUnique({
      where: { id },
      include: { unidadMedida: true, proveedores: { include: { proveedor: true }, orderBy: { precio: "asc" } } },
    });
    if (!resultado) throw AppError.notFound("Repuesto no encontrado");
    return resultado;
  },
};

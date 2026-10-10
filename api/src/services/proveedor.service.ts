import { AppError } from "../utils/app-error";
import { prisma } from "../config/prisma";

export const proveedorService = {
  async listar() {
    return prisma.proveedor.findMany({

      orderBy: [{ nombre: "asc" }, { id: "asc" }],
    });
  },

  async obtenerPorId(id: number) {
    const resultado = await prisma.proveedor.findUnique({
      where: { id },
      include: { repuestos: { include: { repuesto: { include: { unidadMedida: true } } } } },
    });
    if (!resultado) throw AppError.notFound("Proveedor no encontrado");
    return resultado;
  },
};

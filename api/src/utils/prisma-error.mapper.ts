import { Prisma } from "../generated/prisma/client";
import { AppError } from "./app-error";

export function mapPrismaError(error: unknown, method: string): AppError | null {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
        return null;
    }

    switch (error.code) {
        case "P2002": {
            const campos = obtenerCampos(error.meta);
            return AppError.conflict(
                campos
                    ? `Ya existe un registro con el mismo valor en: ${campos}`
                    : "Ya existe un registro con esos datos"
            );
        }
        case "P2025":
            return AppError.notFound("El registro solicitado no existe");
        case "P2003":
            if (method === "DELETE") {
                return AppError.conflict(
                    "No se puede eliminar el registro porque tiene información asociada"
                );
            }
            return AppError.badRequest(
                "Se hace referencia a un registro relacionado que no existe"
            );
        case "P2014":
            return AppError.conflict(
                "La operación viola una relación obligatoria entre registros"
            );
        default:
            return null;
    }
}

function obtenerCampos(meta: Record<string, unknown> | undefined): string | null {
    const target = meta?.target;
    if (Array.isArray(target)) {
        return target.join(", ");
    }
    if (typeof target === "string") {
        return target;
    }
    return null;
}

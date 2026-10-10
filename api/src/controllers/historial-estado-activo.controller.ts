import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { historialEstadoActivoService } from "../services/historial-estado-activo.service";

export class HistorialEstadoActivoController {
  listar = async (request: Request, response: Response, next: NextFunction) => {
    const resultado = await historialEstadoActivoService.listar();
    return response.status(StatusCodes.OK).json({ success: true, data: resultado });
  };

  obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
    const rawId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const id = typeof rawId === "string" && /^[1-9]\d*$/.test(rawId) ? Number(rawId) : NaN;
    if (!Number.isSafeInteger(id) || id > 2147483647) {
      return response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "ID inválido" });
    }
    const resultado = await historialEstadoActivoService.obtenerPorId(id);
    if (!resultado) {
      return response.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Historial de vehículo no encontrado" });
    }
    return response.status(StatusCodes.OK).json({ success: true, data: resultado });
  };
}

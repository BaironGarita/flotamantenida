import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { nivelCertificacionService } from "../services/nivel-certificacion.service";

export class NivelCertificacionController {
  listar = async (request: Request, response: Response, next: NextFunction) => {
    const resultado = await nivelCertificacionService.listar();
    return response.status(StatusCodes.OK).json({ success: true, data: resultado });
  };

  obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
    const rawId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const id = typeof rawId === "string" && /^[1-9]\d*$/.test(rawId) ? Number(rawId) : NaN;
    if (!Number.isSafeInteger(id) || id > 2147483647) {
      return response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "ID inválido" });
    }
    const resultado = await nivelCertificacionService.obtenerPorId(id);
    if (!resultado) {
      return response.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Nivel de certificación no encontrado" });
    }
    return response.status(StatusCodes.OK).json({ success: true, data: resultado });
  };
}

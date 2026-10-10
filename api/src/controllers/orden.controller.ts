import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ordenService } from "../services/orden.service";

export class OrdenController {
  listar = async (request: Request, response: Response, next: NextFunction) => {
    const resultado = await ordenService.listar();
    return response.status(StatusCodes.OK).json({ success: true, data: resultado });
  };

  // Filtro de consulta para la guía; no representa autorización de usuarios.
  listarPorUsuario = async (request: Request, response: Response, next: NextFunction) => {
    const rawId = request.query.usuarioId;
    const usuarioId = typeof rawId === "string" && /^[1-9]\d*$/.test(rawId) ? Number(rawId) : NaN;
    if (!Number.isSafeInteger(usuarioId) || usuarioId > 2147483647) {
      return response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "ID de usuario inválido" });
    }
    const resultado = await ordenService.listarPorUsuario(usuarioId);
    return response.status(StatusCodes.OK).json({ success: true, data: resultado });
  };

  obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
    const rawId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const id = typeof rawId === "string" && /^[1-9]\d*$/.test(rawId) ? Number(rawId) : NaN;
    if (!Number.isSafeInteger(id) || id > 2147483647) {
      return response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "ID inválido" });
    }
    const resultado = await ordenService.obtenerPorId(id);
    if (!resultado) {
      return response.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Orden de mantenimiento no encontrada" });
    }
    return response.status(StatusCodes.OK).json({ success: true, data: resultado });
  };
}

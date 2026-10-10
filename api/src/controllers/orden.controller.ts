import type { Request, Response } from "express";
import { ordenService } from "../services/orden.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess, sendCreated } from "../utils/http-response";

export class OrdenController {
  listar = async (request: Request, response: Response) => {
    const resultado = await ordenService.listar();
    return sendSuccess(response, resultado);
  };

  // Consulta de demostración; usuarioId no autentica ni autoriza al solicitante.
  listarPorUsuario = async (request: Request, response: Response) => {
    const usuarioId = parseId(typeof request.query.usuarioId === "string" ? request.query.usuarioId : undefined, "ID de usuario inválido");
    return sendSuccess(response, await ordenService.listarPorUsuario(usuarioId));
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await ordenService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };

  crear = async (request: Request, response: Response) => {
    return sendCreated(response, await ordenService.crear(request.body), "Solicitud creada correctamente");
  };
  actualizar = async (request: Request, response: Response) => {
    return sendSuccess(response, await ordenService.actualizar(parseId(request.params.id), request.body), "Solicitud actualizada correctamente");
  };
}

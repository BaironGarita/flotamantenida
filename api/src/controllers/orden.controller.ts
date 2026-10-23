import { ordenResponseDto } from "../dtos/response.dto";
import type { Request, Response } from "express";
import { ordenService } from "../services/orden.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess, sendCreated } from "../utils/http-response";

export class OrdenController {
  listar = async (request: Request, response: Response) => {
    const activoId = request.query.activoId === undefined ? undefined : parseId(request.query.activoId, "ID de activo inválido");
    const resultado = await ordenService.listar(activoId);
    return sendSuccess(response, ordenResponseDto(resultado));
  };

  // Consulta de demostración; usuarioId no autentica ni autoriza al solicitante.
  listarPorUsuario = async (request: Request, response: Response) => {
    const usuarioId = parseId(typeof request.query.usuarioId === "string" ? request.query.usuarioId : undefined, "ID de usuario inválido");
    return sendSuccess(response, ordenResponseDto(await ordenService.listarPorUsuario(usuarioId)));
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await ordenService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, ordenResponseDto(resultado));
  };

  crear = async (request: Request, response: Response) => {
    return sendCreated(response, ordenResponseDto(await ordenService.crear(request.body)), "Solicitud creada correctamente");
  };
  actualizar = async (request: Request, response: Response) => {
    return sendSuccess(response, ordenResponseDto(await ordenService.actualizar(parseId(request.params.id), request.body)), "Solicitud actualizada correctamente");
  };
}

import type { Request, Response } from "express";
import { tipoMantenimientoService } from "../services/tipo-mantenimiento.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess } from "../utils/http-response";

export class TipoMantenimientoController {
  listar = async (request: Request, response: Response) => {
    const resultado = await tipoMantenimientoService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await tipoMantenimientoService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
}

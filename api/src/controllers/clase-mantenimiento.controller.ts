import type { Request, Response } from "express";
import { claseMantenimientoService } from "../services/clase-mantenimiento.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess } from "../utils/http-response";

export class ClaseMantenimientoController {
  listar = async (request: Request, response: Response) => {
    const resultado = await claseMantenimientoService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await claseMantenimientoService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
}

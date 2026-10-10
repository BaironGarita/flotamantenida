import type { Request, Response } from "express";
import { prioridadService } from "../services/prioridad.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess } from "../utils/http-response";

export class PrioridadController {
  listar = async (request: Request, response: Response) => {
    const resultado = await prioridadService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await prioridadService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
}

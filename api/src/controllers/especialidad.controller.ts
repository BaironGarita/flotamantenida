import type { Request, Response } from "express";
import { especialidadService } from "../services/especialidad.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess } from "../utils/http-response";

export class EspecialidadController {
  listar = async (request: Request, response: Response) => {
    const resultado = await especialidadService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await especialidadService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
}

import type { Request, Response } from "express";
import { especialidadService } from "../services/especialidad.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess, sendCreated } from "../utils/http-response";

export class EspecialidadController {
  listar = async (request: Request, response: Response) => {
    const resultado = await especialidadService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await especialidadService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
  crear = async (request: Request, response: Response) => sendCreated(response, await especialidadService.crear(request.body), "Especialidad creada correctamente");
  actualizar = async (request: Request, response: Response) => sendSuccess(response, await especialidadService.actualizar(parseId(request.params.id), request.body), "Especialidad actualizada correctamente");
}

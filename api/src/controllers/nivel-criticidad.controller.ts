import type { Request, Response } from "express";
import { nivelCriticidadService } from "../services/nivel-criticidad.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess } from "../utils/http-response";

export class NivelCriticidadController {
  listar = async (request: Request, response: Response) => {
    const resultado = await nivelCriticidadService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await nivelCriticidadService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
}

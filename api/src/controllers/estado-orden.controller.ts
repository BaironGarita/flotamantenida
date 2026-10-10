import type { Request, Response } from "express";
import { estadoOrdenService } from "../services/estado-orden.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess } from "../utils/http-response";

export class EstadoOrdenController {
  listar = async (request: Request, response: Response) => {
    const resultado = await estadoOrdenService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await estadoOrdenService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
}

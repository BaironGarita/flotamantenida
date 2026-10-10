import type { Request, Response } from "express";
import { historialEstadoOrdenService } from "../services/historial-estado-orden.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess } from "../utils/http-response";

export class HistorialEstadoOrdenController {
  listar = async (request: Request, response: Response) => {
    const resultado = await historialEstadoOrdenService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await historialEstadoOrdenService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
}

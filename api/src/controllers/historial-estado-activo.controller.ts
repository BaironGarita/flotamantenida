import type { Request, Response } from "express";
import { historialEstadoActivoService } from "../services/historial-estado-activo.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess } from "../utils/http-response";

export class HistorialEstadoActivoController {
  listar = async (request: Request, response: Response) => {
    const resultado = await historialEstadoActivoService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await historialEstadoActivoService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
}

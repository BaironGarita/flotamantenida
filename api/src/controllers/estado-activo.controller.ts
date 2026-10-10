import type { Request, Response } from "express";
import { estadoActivoService } from "../services/estado-activo.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess } from "../utils/http-response";

export class EstadoActivoController {
  listar = async (request: Request, response: Response) => {
    const resultado = await estadoActivoService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await estadoActivoService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
}

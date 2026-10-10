import type { Request, Response } from "express";
import { unidadMedidaService } from "../services/unidad-medida.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess } from "../utils/http-response";

export class UnidadMedidaController {
  listar = async (request: Request, response: Response) => {
    const resultado = await unidadMedidaService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await unidadMedidaService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
}

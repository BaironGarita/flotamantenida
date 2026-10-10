import type { Request, Response } from "express";
import { repuestoService } from "../services/repuesto.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess } from "../utils/http-response";

export class RepuestoController {
  listar = async (request: Request, response: Response) => {
    const resultado = await repuestoService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await repuestoService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
}

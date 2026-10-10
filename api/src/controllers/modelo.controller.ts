import type { Request, Response } from "express";
import { modeloService } from "../services/modelo.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess } from "../utils/http-response";

export class ModeloController {
  listar = async (request: Request, response: Response) => {
    const resultado = await modeloService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await modeloService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
}

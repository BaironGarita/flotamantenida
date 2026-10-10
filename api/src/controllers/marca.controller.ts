import type { Request, Response } from "express";
import { marcaService } from "../services/marca.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess } from "../utils/http-response";

export class MarcaController {
  listar = async (request: Request, response: Response) => {
    const resultado = await marcaService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await marcaService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
}

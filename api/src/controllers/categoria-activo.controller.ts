import type { Request, Response } from "express";
import { categoriaActivoService } from "../services/categoria-activo.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess } from "../utils/http-response";

export class CategoriaActivoController {
  listar = async (request: Request, response: Response) => {
    const resultado = await categoriaActivoService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await categoriaActivoService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
}

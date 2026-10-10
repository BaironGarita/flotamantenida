import type { Request, Response } from "express";
import { tipoCombustibleService } from "../services/tipo-combustible.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess } from "../utils/http-response";

export class TipoCombustibleController {
  listar = async (request: Request, response: Response) => {
    const resultado = await tipoCombustibleService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await tipoCombustibleService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
}

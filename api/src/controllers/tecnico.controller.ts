import type { Request, Response } from "express";
import { tecnicoService } from "../services/tecnico.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess } from "../utils/http-response";

export class TecnicoController {
  listar = async (request: Request, response: Response) => {
    const resultado = await tecnicoService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await tecnicoService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
}

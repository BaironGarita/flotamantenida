import type { Request, Response } from "express";
import { rolService } from "../services/rol.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess } from "../utils/http-response";

export class RolController {
  listar = async (request: Request, response: Response) => {
    const resultado = await rolService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await rolService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
}

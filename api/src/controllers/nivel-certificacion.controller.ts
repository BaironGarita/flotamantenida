import type { Request, Response } from "express";
import { nivelCertificacionService } from "../services/nivel-certificacion.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess } from "../utils/http-response";

export class NivelCertificacionController {
  listar = async (request: Request, response: Response) => {
    const resultado = await nivelCertificacionService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await nivelCertificacionService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
}

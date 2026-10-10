import type { Request, Response } from "express";
import { usuarioService } from "../services/usuario.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess } from "../utils/http-response";

export class UsuarioController {
  listar = async (request: Request, response: Response) => {
    const resultado = await usuarioService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await usuarioService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
}

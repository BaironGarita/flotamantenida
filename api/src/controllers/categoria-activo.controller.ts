import type { Request, Response } from "express";
import { categoriaActivoService } from "../services/categoria-activo.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess, sendCreated } from "../utils/http-response";

export class CategoriaActivoController {
  listar = async (request: Request, response: Response) => {
    const resultado = await categoriaActivoService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await categoriaActivoService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
  crear = async (request: Request, response: Response) => sendCreated(response, await categoriaActivoService.crear(request.body), "Categoría creada correctamente");
  actualizar = async (request: Request, response: Response) => sendSuccess(response, await categoriaActivoService.actualizar(parseId(request.params.id), request.body), "Categoría actualizada correctamente");
  desactivar = async (request: Request, response: Response) => sendSuccess(response, await categoriaActivoService.desactivar(parseId(request.params.id)), "Categoría desactivada correctamente");
}

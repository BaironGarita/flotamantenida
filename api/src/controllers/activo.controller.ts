import type { Request, Response } from "express";
import { activoService } from "../services/activo.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess, sendCreated, getPaginationParams, buildPaginationMeta, sendPaginated } from "../utils/http-response";

export class ActivoController {
  listar = async (request: Request, response: Response) => {
    const { page, limit, skip } = getPaginationParams(request.query);
    const parseOptionalId = (value: unknown, message: string) => value === undefined ? undefined : parseId(value, message);
    const categoriaId = parseOptionalId(request.query.categoriaId, "ID de categoría inválido");
    const estadoActivoId = parseOptionalId(request.query.estadoActivoId, "ID de estado inválido");
    const { data, total } = await activoService.listar(skip, limit, categoriaId, estadoActivoId);
    return sendPaginated(response, data, buildPaginationMeta(total, page, limit));
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await activoService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };

  crear = async (request: Request, response: Response) => {
    return sendCreated(response, await activoService.crear(request.body), "Vehículo creado correctamente");
  };
  actualizar = async (request: Request, response: Response) => {
    return sendSuccess(response, await activoService.actualizar(parseId(request.params.id), request.body), "Vehículo actualizado correctamente");
  };
  cambiarEstado = async (request: Request, response: Response) => sendSuccess(response, await activoService.cambiarEstadoAdministrativo(parseId(request.params.id), request.body.estadoActivoId), "Estado administrativo actualizado correctamente");
  darDeBaja = async (request: Request, response: Response) => sendSuccess(response, await activoService.darDeBaja(parseId(request.params.id)), "Vehículo dado de baja correctamente");
}

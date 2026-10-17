import type { Request, Response } from "express";
import { tecnicoService } from "../services/tecnico.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess, sendCreated } from "../utils/http-response";
import { AppError } from "../utils/app-error";

export class TecnicoController {
  listar = async (request: Request, response: Response) => {
    const especialidadId = request.query.especialidadId === undefined ? undefined : parseId(request.query.especialidadId, "ID de especialidad inválido");
    const rawDisponible = request.query.disponible;
    const disponible = rawDisponible === undefined ? undefined : rawDisponible === "true" ? true : rawDisponible === "false" ? false : (() => { throw AppError.badRequest("El filtro disponible debe ser true o false"); })();
    const resultado = await tecnicoService.listar(especialidadId, disponible);
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await tecnicoService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
  crear = async (request: Request, response: Response) => sendCreated(response, await tecnicoService.crear(request.body), "Técnico creado correctamente");
  actualizar = async (request: Request, response: Response) => sendSuccess(response, await tecnicoService.actualizar(parseId(request.params.id), request.body), "Técnico actualizado correctamente");
  asociarEspecialidad = async (request: Request, response: Response) => sendCreated(response, await tecnicoService.asociarEspecialidad(parseId(request.params.id), request.body), "Especialidad asociada correctamente");
  desasociarEspecialidad = async (request: Request, response: Response) => sendSuccess(response, await tecnicoService.desasociarEspecialidad(parseId(request.params.id), parseId(request.params.especialidadId)), "Especialidad desasociada correctamente");
}

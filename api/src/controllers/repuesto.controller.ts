import { repuestoResponseDto, repuestoProveedorResponseDto } from "../dtos/response.dto";
import type { Request, Response } from "express";
import { repuestoService } from "../services/repuesto.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess, sendCreated } from "../utils/http-response";
import { AppError } from "../utils/app-error";

export class RepuestoController {
  listar = async (request: Request, response: Response) => {
    const rawStockBajo = request.query.stockBajo;
    if (rawStockBajo !== undefined && rawStockBajo !== "true" && rawStockBajo !== "false") throw AppError.badRequest("El filtro stockBajo debe ser true o false");
    const resultado = await repuestoService.listar(rawStockBajo === "true");
    return sendSuccess(response, repuestoResponseDto(resultado));
  };
  listarStockBajo = async (_request: Request, response: Response) => sendSuccess(response, repuestoResponseDto(await repuestoService.listar(true)));

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await repuestoService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, repuestoResponseDto(resultado));
  };
  crear = async (request: Request, response: Response) => sendCreated(response, repuestoResponseDto(await repuestoService.crear(request.body)), "Repuesto creado correctamente");
  actualizar = async (request: Request, response: Response) => sendSuccess(response, repuestoResponseDto(await repuestoService.actualizar(parseId(request.params.id), request.body)), "Repuesto actualizado correctamente");
  asociarProveedor = async (request: Request, response: Response) => sendCreated(response, repuestoProveedorResponseDto(await repuestoService.asociarProveedor(parseId(request.params.id), request.body)), "Proveedor asociado correctamente");
  actualizarProveedor = async (request: Request, response: Response) => sendSuccess(response, repuestoProveedorResponseDto(await repuestoService.actualizarProveedor(parseId(request.params.id), parseId(request.params.proveedorId), request.body)), "Condiciones actualizadas correctamente");
}

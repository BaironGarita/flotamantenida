import { proveedorResponseDto } from "../dtos/response.dto";
import type { Request, Response } from "express";
import { proveedorService } from "../services/proveedor.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess, sendCreated } from "../utils/http-response";

export class ProveedorController {
  listar = async (request: Request, response: Response) => {
    const resultado = await proveedorService.listar();
    return sendSuccess(response, proveedorResponseDto(resultado));
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await proveedorService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, proveedorResponseDto(resultado));
  };
  crear = async (request: Request, response: Response) => sendCreated(response, proveedorResponseDto(await proveedorService.crear(request.body)), "Proveedor creado correctamente");
  actualizar = async (request: Request, response: Response) => sendSuccess(response, proveedorResponseDto(await proveedorService.actualizar(parseId(request.params.id), request.body)), "Proveedor actualizado correctamente");
}

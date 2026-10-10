import type { Request, Response } from "express";
import { proveedorService } from "../services/proveedor.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess } from "../utils/http-response";

export class ProveedorController {
  listar = async (request: Request, response: Response) => {
    const resultado = await proveedorService.listar();
    return sendSuccess(response, resultado);
  };

  obtenerPorId = async (request: Request, response: Response) => {
    const resultado = await proveedorService.obtenerPorId(parseId(request.params.id));
    return sendSuccess(response, resultado);
  };
}

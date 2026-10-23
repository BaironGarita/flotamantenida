import { activoResponseDto } from "../dtos/response.dto";
import type { Request, Response, NextFunction } from "express";
import { imageService } from "../services/image.service";
import { sendSuccess, sendCreated } from "../utils/http-response";
import { parseId } from "../utils/parse-id";

export class ImageController {
  upload = async (request: Request, response: Response) => {
    const result = await imageService.uploadImage(request.file, request.body?.previousFileName);
    return sendCreated(response, result, "Imagen subida correctamente");
  };
  getListFiles = async (_request: Request, response: Response) => sendSuccess(response, await imageService.listImages());
  download = async (request: Request, response: Response, next: NextFunction) => {
    const filePath = await imageService.getImagePath(request.params.name);
    response.download(filePath, error => { if (error) next(error); });
  };
  updateActivo = async (request: Request, response: Response) => {
    return sendSuccess(response, activoResponseDto(await imageService.updateActivoImage(parseId(request.params.id), request.file)), "Imagen del vehículo actualizada correctamente");
  };
}

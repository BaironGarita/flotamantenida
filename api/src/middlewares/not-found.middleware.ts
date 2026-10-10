import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
    next(AppError.notFound(`La ruta ${req.method} ${req.originalUrl} no existe`));
}

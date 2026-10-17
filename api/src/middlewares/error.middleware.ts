import multer from "multer";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";
import { mapPrismaError } from "../utils/prisma-error.mapper";
import { sendError } from "../utils/http-response";
import { logger } from "../config/logger";

export class ErrorMiddleware {
  static handleError(error: unknown, req: Request, res: Response, next: NextFunction): void {
    if (res.headersSent) { next(error); return; }
    let appError = error instanceof AppError ? error : mapPrismaError(error, req.method);
    if (error instanceof multer.MulterError) {
      appError = AppError.badRequest(error.code === "LIMIT_FILE_SIZE" ? "La imagen no puede superar 2 MB" : "Formulario inválido: envíe una sola imagen en el campo image");
    }
    if (!appError && error instanceof SyntaxError && "status" in error && error.status === 400) {
      appError = AppError.badRequest("JSON inválido");
    }
    if (appError?.isOperational) {
      logger.warn({ message: appError.message, error: appError.name, statusCode: appError.statusCode,
        method: req.method, path: req.originalUrl, validationErrors: appError.validationErrors });
      sendError(res, { statusCode: appError.statusCode, error: appError.name, message: appError.message,
        path: req.originalUrl, validationErrors: appError.validationErrors });
      return;
    }
    // Nunca guardar el body, credenciales ni detalles de la conexión en el log.
    logger.error({ message: "Error no controlado", method: req.method, path: req.path,
      error: error instanceof Error ? error.name : "UnknownError",
      stack: error instanceof Error ? error.stack?.split("\n").slice(1).join("\n") : undefined });
    sendError(res, { statusCode: 500, error: "InternalServerError", message: "Error interno del servidor", path: req.originalUrl });
  }
}

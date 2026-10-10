import { StatusCodes } from "http-status-codes";
import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }
  if (error instanceof SyntaxError && "status" in error && error.status === StatusCodes.BAD_REQUEST) {
    response.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "JSON inválido" });
    return;
  }
  // No devolver credenciales o detalles internos de la base de datos al cliente.
  console.error("Error procesando la solicitud:", error instanceof Error ? error.name : "Error");
  response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error interno del servidor" });
};

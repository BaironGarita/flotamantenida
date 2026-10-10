// Compatibilidad con importaciones anteriores; existe un único manejador.
export { ErrorMiddleware } from "../middlewares/error.middleware";
import { ErrorMiddleware } from "../middlewares/error.middleware";
export const errorHandler = ErrorMiddleware.handleError;

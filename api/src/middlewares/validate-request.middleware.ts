import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../utils/app-error";

export function validateRequest(schema: ZodSchema) {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const validationErrors = result.error.issues.map((issue) => ({
                field: issue.path.join(".") || "body",
                message: issue.code === "unrecognized_keys" ? "Se enviaron campos no permitidos" : issue.message,
            }));

            throw AppError.badRequest("Datos de entrada inválidos", validationErrors);
        }

        req.body = result.data;
        next();
    };
}
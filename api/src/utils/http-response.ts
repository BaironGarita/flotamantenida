import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ValidationErrorDetail } from "./app-error";

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
}

export interface ApiSuccessResponse<T> {
    success: true;
    statusCode: number;
    message: string;
    meta?: PaginationMeta;
    data: T;
}

export interface ApiErrorResponse {
    success: false;
    statusCode: number;
    error: string;
    message: string;
    timestamp: string;
    path: string;
    validationErrors?: ValidationErrorDetail[] | undefined;
}

interface ErrorResponseArgs {
    statusCode: number;
    error: string;
    message: string;
    path: string;
    validationErrors?: ValidationErrorDetail[] | undefined;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export function sendSuccess<T>(
    res: Response,
    data: T,
    message = "Operación realizada correctamente",
    statusCode: StatusCodes = StatusCodes.OK
) {
    const body: ApiSuccessResponse<T> = {
        success: true,
        statusCode,
        message,
        data,
    };
    return res.status(statusCode).json(body);
}

export function sendCreated<T>(
    res: Response,
    data: T,
    message = "Recurso creado correctamente"
) {
    return sendSuccess(res, data, message, StatusCodes.CREATED);
}

export function sendPaginated<T>(
    res: Response,
    data: T[],
    meta: PaginationMeta,
    message = "Consulta realizada correctamente"
) {
    const body: ApiSuccessResponse<T[]> = {
        success: true,
        statusCode: StatusCodes.OK,
        message,
        meta,
        data,
    };
    return res.status(StatusCodes.OK).json(body);
}

export function sendNoContent(res: Response) {
    return res.status(StatusCodes.NO_CONTENT).send();
}

export function sendError(res: Response, args: ErrorResponseArgs) {
    const body: ApiErrorResponse = {
        success: false,
        statusCode: args.statusCode,
        error: args.error,
        message: args.message,
        timestamp: new Date().toISOString(),
        path: args.path,
    };

    if (args.validationErrors?.length) {
        body.validationErrors = args.validationErrors;
    }

    return res.status(args.statusCode).json(body);
}

export function getPaginationParams(query: Record<string, unknown>): PaginationParams {
    const page = Math.min(toPositiveInt(query.page, DEFAULT_PAGE), 21474836);
    const limit = Math.min(toPositiveInt(query.limit, DEFAULT_LIMIT), MAX_LIMIT);

    return {
        page,
        limit,
        skip: (page - 1) * limit,
    };
}

export function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
    const totalPages = Math.ceil(total / limit);

    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };
}

function toPositiveInt(value: unknown, defaultValue: number): number {
    const raw = Array.isArray(value) ? value[0] : value;
    const parsed = Number(raw);
    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : defaultValue;
}
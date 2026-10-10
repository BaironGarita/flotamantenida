import type { Request, Response, NextFunction } from "express";

export function asyncHandler(
  fn: (request: Request, response: Response, next: NextFunction) => Promise<unknown>
) {
  return (request: Request, response: Response, next: NextFunction) => {
    Promise.resolve().then(() => fn(request, response, next)).catch(next);
  };
}

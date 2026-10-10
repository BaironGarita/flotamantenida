import { AppError } from "./app-error";

export function parseId(rawId: unknown, message = "ID inválido"): number {
  const value = Array.isArray(rawId) ? rawId[0] : rawId;
  const id = typeof value === "string" && /^[1-9]\d*$/.test(value) ? Number(value) : NaN;
  if (!Number.isSafeInteger(id) || id > 2147483647) throw AppError.badRequest(message);
  return id;
}

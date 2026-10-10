// Prisma con exactOptionalPropertyTypes necesita omitir las claves ausentes.
export function omitUndefined<T extends object>(data: T): { [K in keyof T]: Exclude<T[K], undefined> } {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)) as {
    [K in keyof T]: Exclude<T[K], undefined>
  };
}

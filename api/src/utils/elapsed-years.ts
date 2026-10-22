// Años completos desde una fecha. UTC evita diferencias entre zonas horarias.
export function elapsedYears(fecha: Date, hoy = new Date()): number {
  let years = hoy.getUTCFullYear() - fecha.getUTCFullYear();
  if (hoy.getUTCMonth() < fecha.getUTCMonth() ||
      (hoy.getUTCMonth() === fecha.getUTCMonth() && hoy.getUTCDate() < fecha.getUTCDate())) years -= 1;
  return Math.max(0, years);
}

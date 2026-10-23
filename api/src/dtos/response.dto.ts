/** Contratos de salida del Avance 1. Independientes del cliente Prisma. */
export interface ActivoResponseDto {
  id: number;
  codigo?: string;
  nombre?: string;
  descripcion?: string | null;
  placa?: string;
  modeloId?: number;
  anio?: number;
  tipoCombustibleId?: number;
  categoriaId?: number;
  nivelCriticidadId?: number;
  estadoActivoId?: number;
  fechaAdquisicion?: string;
  valorReferencia?: string;
  kilometrajeRegistro?: number;
  kilometrajeActual?: number;
  imagenUrl?: string | null;
  fechaCreacion?: string;
  antiguedadAnios?: number;
  cantidadOrdenes?: number;
  modelo?: CatalogoResponseDto;
  categoria?: CategoriaActivoResponseDto;
  estadoActivo?: CatalogoResponseDto;
  tipoCombustible?: CatalogoResponseDto;
  nivelCriticidad?: CatalogoResponseDto;
  ordenes?: OrdenMantenimientoResponseDto[];
  historial?: HistorialResponseDto[];
}

export interface CategoriaActivoResponseDto {
  id: number;
  nombre?: string;
  descripcion?: string | null;
  intervaloKm?: number;
  margenAlertaKm?: number;
  activo?: boolean;
  cantidadActivos?: number;
  activos?: ActivoResponseDto[];
}

export interface TecnicoResponseDto {
  id: number;
  identificacion?: string;
  nombreCompleto?: string;
  telefono?: string;
  correo?: string;
  tarifaHora?: string;
  disponible?: boolean;
  activo?: boolean;
  cantidadEspecialidades?: number;
  especialidades?: TecnicoEspecialidadResponseDto[];
  asignaciones?: OrdenTecnicoResponseDto[];
}

export interface EspecialidadResponseDto {
  id: number;
  nombre?: string;
  descripcion?: string | null;
  activo?: boolean;
  cantidadTecnicos?: number;
  tecnicos?: TecnicoEspecialidadResponseDto[];
}

export interface RepuestoResponseDto {
  id: number;
  codigo?: string;
  nombre?: string;
  descripcion?: string | null;
  unidadMedidaId?: number;
  stockActual?: number;
  stockMinimo?: number;
  activo?: boolean;
  stockBajo?: boolean;
  faltanteStock?: number;
  cantidadProveedores?: number;
  unidadMedida?: CatalogoResponseDto;
  proveedores?: RepuestoProveedorResponseDto[];
}

export interface ProveedorResponseDto {
  id: number;
  cedulaJuridica?: string;
  nombre?: string;
  contacto?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  condicionesGenerales?: string | null;
  activo?: boolean;
  repuestos?: RepuestoProveedorResponseDto[];
}

export interface OrdenMantenimientoResponseDto {
  id: number;
  codigo?: string;
  activoId?: number;
  tipoMantenimientoId?: number;
  prioridadId?: number | null;
  estadoOrdenId?: number;
  usuarioSolicitanteId?: number;
  motivo?: string;
  diagnostico?: string | null;
  kilometrajeAlSolicitar?: number;
  fechaSolicitud?: string;
  fechaProgramada?: string | null;
  fechaInicio?: string | null;
  fechaCierre?: string | null;
  costoTotal?: string;
  diasTranscurridos?: number;
  activo?: ActivoResponseDto;
  tipoMantenimiento?: CatalogoResponseDto;
  prioridad?: CatalogoResponseDto | null;
  estadoOrden?: CatalogoResponseDto;
  usuarioSolicitante?: UsuarioPublicoResponseDto;
  tecnicos?: OrdenTecnicoResponseDto[];
  repuestos?: OrdenRepuestoResponseDto[];
  historial?: HistorialResponseDto[];
  historialActivos?: HistorialResponseDto[];
}

export interface CatalogoResponseDto {
  id?: number; nombre?: string; descripcion?: string | null; activo?: boolean; nivel?: number;
  abreviatura?: string; marcaId?: number; claseMantenimientoId?: number; especialidadId?: number;
  marca?: CatalogoResponseDto; clase?: CatalogoResponseDto; especialidad?: EspecialidadResponseDto;
}
export interface UsuarioPublicoResponseDto {
  id?: number; rolId?: number; nombreCompleto?: string; correo?: string; activo?: boolean;
  fechaCreacion?: string; ultimoAcceso?: string | null; rol?: CatalogoResponseDto;
}
export interface HistorialResponseDto {
  id?: number; activoId?: number; ordenId?: number | null; estadoAnteriorId?: number | null;
  estadoNuevoId?: number; usuarioId?: number; fechaCambio?: string;
  observacion?: string | null; motivo?: string | null;
  estadoAnterior?: CatalogoResponseDto | null; estadoNuevo?: CatalogoResponseDto; usuario?: UsuarioPublicoResponseDto;
}
export interface OrdenTecnicoResponseDto {
  ordenId?: number; tecnicoId?: number; fechaAsignacion?: string; horasTrabajadas?: string;
  tarifaHoraAplicada?: string; tecnico?: TecnicoResponseDto; orden?: OrdenMantenimientoResponseDto;
}
export interface OrdenRepuestoResponseDto {
  id?: number; ordenId?: number; repuestoId?: number; proveedorId?: number; cantidad?: number;
  costoUnitario?: string; pendiente?: boolean; fechaRegistro?: string;
  repuesto?: RepuestoResponseDto; proveedor?: ProveedorResponseDto;
}

export interface TecnicoEspecialidadResponseDto {
  tecnicoId?: number; especialidadId?: number; nivelCertificacionId?: number;
  fechaCertificacion?: string; antiguedadAnios?: number;
  tecnico?: TecnicoResponseDto; especialidad?: EspecialidadResponseDto; nivelCertificacion?: CatalogoResponseDto;
}
export interface RepuestoProveedorResponseDto {
  repuestoId?: number; proveedorId?: number; precio?: string; tiempoEntregaDias?: number;
  repuesto?: RepuestoResponseDto; proveedor?: ProveedorResponseDto;
}

type Mapper = (source: unknown) => unknown;
type Relations = Record<string, Mapper>;

// Solo se copian los campos del contrato, nunca el objeto completo del ORM.
function project<T>(source: unknown, fields: readonly string[], relations: Relations = {}): T {
  const row = source as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const field of fields) {
    const value = row[field];
    if (value === undefined) continue;
    if (value instanceof Date) result[field] = value.toISOString();
    else if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) result[field] = value;
    else if (typeof value === 'object' && 'toJSON' in value && typeof value.toJSON === 'function') {
      const decimal: unknown = value.toJSON();
      if (typeof decimal === 'string' || typeof decimal === 'number') result[field] = decimal;
    }
  }
  for (const [field, mapper] of Object.entries(relations)) {
    const value = row[field];
    if (value === undefined) continue;
    result[field] = value === null ? null : Array.isArray(value) ? value.map(item => mapper(item)) : mapper(value);
  }
  return result as T;
}

function catalogo(source: unknown): CatalogoResponseDto {
  return project(source, ['id','nombre','descripcion','activo','nivel','abreviatura','marcaId','claseMantenimientoId','especialidadId'], {
    marca: catalogo, clase: catalogo, especialidad: especialidadResponseDto,
  });
}
function usuarioPublico(source: unknown): UsuarioPublicoResponseDto {
  return project(source, ['id','rolId','nombreCompleto','correo','activo','fechaCreacion','ultimoAcceso'], { rol: catalogo });
}
function historial(source: unknown): HistorialResponseDto {
  return project(source, ['id','activoId','ordenId','estadoAnteriorId','estadoNuevoId','usuarioId','fechaCambio','observacion','motivo'], {
    estadoAnterior: catalogo, estadoNuevo: catalogo, usuario: usuarioPublico,
  });
}
function asignacion(source: unknown): OrdenTecnicoResponseDto {
  return project(source, ['ordenId','tecnicoId','fechaAsignacion','horasTrabajadas','tarifaHoraAplicada'], {
    tecnico: tecnicoResponseDto, orden: ordenResponseDto,
  });
}
function usoRepuesto(source: unknown): OrdenRepuestoResponseDto {
  return project(source, ['id','ordenId','repuestoId','proveedorId','cantidad','costoUnitario','pendiente','fechaRegistro'], {
    repuesto: repuestoResponseDto, proveedor: proveedorResponseDto,
  });
}
export function tecnicoEspecialidadResponseDto(source: unknown): TecnicoEspecialidadResponseDto {
  return project(source, ['tecnicoId','especialidadId','nivelCertificacionId','fechaCertificacion','antiguedadAnios'], {
    tecnico: tecnicoResponseDto, especialidad: especialidadResponseDto, nivelCertificacion: catalogo,
  });
}
export function repuestoProveedorResponseDto(source: unknown): RepuestoProveedorResponseDto {
  return project(source, ['repuestoId','proveedorId','precio','tiempoEntregaDias'], {
    repuesto: repuestoResponseDto, proveedor: proveedorResponseDto,
  });
}

export function activoResponseDto(source: readonly unknown[]): ActivoResponseDto[];
export function activoResponseDto(source: unknown): ActivoResponseDto;
export function activoResponseDto(source: unknown): ActivoResponseDto | ActivoResponseDto[] {
  if (Array.isArray(source)) return source.map(item => activoResponseDto(item));
  return project<ActivoResponseDto>(source, ["id","codigo","nombre","descripcion","placa","modeloId","anio","tipoCombustibleId","categoriaId","nivelCriticidadId","estadoActivoId","fechaAdquisicion","valorReferencia","kilometrajeRegistro","kilometrajeActual","imagenUrl","fechaCreacion","antiguedadAnios","cantidadOrdenes"], { modelo: catalogo, categoria: categoriaResponseDto, estadoActivo: catalogo, tipoCombustible: catalogo, nivelCriticidad: catalogo, ordenes: ordenResponseDto, historial });
}

export function categoriaResponseDto(source: readonly unknown[]): CategoriaActivoResponseDto[];
export function categoriaResponseDto(source: unknown): CategoriaActivoResponseDto;
export function categoriaResponseDto(source: unknown): CategoriaActivoResponseDto | CategoriaActivoResponseDto[] {
  if (Array.isArray(source)) return source.map(item => categoriaResponseDto(item));
  return project<CategoriaActivoResponseDto>(source, ["id","nombre","descripcion","intervaloKm","margenAlertaKm","activo","cantidadActivos"], { activos: activoResponseDto });
}

export function tecnicoResponseDto(source: readonly unknown[]): TecnicoResponseDto[];
export function tecnicoResponseDto(source: unknown): TecnicoResponseDto;
export function tecnicoResponseDto(source: unknown): TecnicoResponseDto | TecnicoResponseDto[] {
  if (Array.isArray(source)) return source.map(item => tecnicoResponseDto(item));
  return project<TecnicoResponseDto>(source, ["id","identificacion","nombreCompleto","telefono","correo","tarifaHora","disponible","activo","cantidadEspecialidades"], { especialidades: tecnicoEspecialidadResponseDto, asignaciones: asignacion });
}

export function especialidadResponseDto(source: readonly unknown[]): EspecialidadResponseDto[];
export function especialidadResponseDto(source: unknown): EspecialidadResponseDto;
export function especialidadResponseDto(source: unknown): EspecialidadResponseDto | EspecialidadResponseDto[] {
  if (Array.isArray(source)) return source.map(item => especialidadResponseDto(item));
  return project<EspecialidadResponseDto>(source, ["id","nombre","descripcion","activo","cantidadTecnicos"], { tecnicos: tecnicoEspecialidadResponseDto });
}

export function repuestoResponseDto(source: readonly unknown[]): RepuestoResponseDto[];
export function repuestoResponseDto(source: unknown): RepuestoResponseDto;
export function repuestoResponseDto(source: unknown): RepuestoResponseDto | RepuestoResponseDto[] {
  if (Array.isArray(source)) return source.map(item => repuestoResponseDto(item));
  return project<RepuestoResponseDto>(source, ["id","codigo","nombre","descripcion","unidadMedidaId","stockActual","stockMinimo","activo","stockBajo","faltanteStock","cantidadProveedores"], { unidadMedida: catalogo, proveedores: repuestoProveedorResponseDto });
}

export function proveedorResponseDto(source: readonly unknown[]): ProveedorResponseDto[];
export function proveedorResponseDto(source: unknown): ProveedorResponseDto;
export function proveedorResponseDto(source: unknown): ProveedorResponseDto | ProveedorResponseDto[] {
  if (Array.isArray(source)) return source.map(item => proveedorResponseDto(item));
  return project<ProveedorResponseDto>(source, ["id","cedulaJuridica","nombre","contacto","telefono","correo","direccion","condicionesGenerales","activo"], { repuestos: repuestoProveedorResponseDto });
}

export function ordenResponseDto(source: readonly unknown[]): OrdenMantenimientoResponseDto[];
export function ordenResponseDto(source: unknown): OrdenMantenimientoResponseDto;
export function ordenResponseDto(source: unknown): OrdenMantenimientoResponseDto | OrdenMantenimientoResponseDto[] {
  if (Array.isArray(source)) return source.map(item => ordenResponseDto(item));
  return project<OrdenMantenimientoResponseDto>(source, ["id","codigo","activoId","tipoMantenimientoId","prioridadId","estadoOrdenId","usuarioSolicitanteId","motivo","diagnostico","kilometrajeAlSolicitar","fechaSolicitud","fechaProgramada","fechaInicio","fechaCierre","costoTotal","diasTranscurridos"], { activo: activoResponseDto, tipoMantenimiento: catalogo, prioridad: catalogo, estadoOrden: catalogo, usuarioSolicitante: usuarioPublico, tecnicos: asignacion, repuestos: usoRepuesto, historial, historialActivos: historial });
}

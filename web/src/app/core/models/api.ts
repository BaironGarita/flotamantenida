export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}
export interface NamedRecord {
  id: number;
  nombre: string;
}
export interface Vehicle {
  id: number;
  codigo: string;
  nombre: string;
  placa: string;
  anio: number;
  kilometrajeActual: number;
  imagenUrl: string | null;
  categoria: NamedRecord;
  estadoActivo: NamedRecord;
  modelo: NamedRecord & { marca: NamedRecord };
}
export interface MaintenanceOrder {
  id: number;
  codigo: string;
  fechaSolicitud: string;
  activo: Pick<Vehicle, 'id' | 'codigo' | 'nombre'>;
  estadoOrden: NamedRecord;
  tipoMantenimiento: NamedRecord;
  prioridad: NamedRecord | null;
}
export interface PublicUser {
  id: number;
  nombreCompleto: string;
  correo: string;
  activo: boolean;
  rol: NamedRecord;
}

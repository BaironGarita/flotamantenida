import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ApiResponse,
  MaintenanceOrder,
  PaginatedResponse,
  PublicUser,
  Vehicle,
} from '../models/api';
@Injectable({ providedIn: 'root' })
export class FlotaApi {
  private http = inject(HttpClient);
  vehicles(page = 1) {
    return this.http.get<PaginatedResponse<Vehicle>>('/api/activo', { params: { page, limit: 6 } });
  }
  orders() {
    return this.http.get<ApiResponse<MaintenanceOrder[]>>('/api/orden');
  }
  users() {
    return this.http.get<ApiResponse<PublicUser[]>>('/api/usuario');
  }
  imageUrl(name: string | null): string | null {
    if (!name) return null;
    const fileName = name.replace(/^uploads\/activos\//, '');
    if (!/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/i.test(fileName)) return null;
    return '/images/' + encodeURIComponent(fileName);
  }
}

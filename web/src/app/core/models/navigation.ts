export type DemoRole = 'SOLICITANTE' | 'COORDINADOR';
export interface DemoUser {
  nombre: string;
  role: DemoRole;
}
export interface MenuItem {
  label: string;
  path: string;
  icon: string;
}

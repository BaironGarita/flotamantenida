// =====================================================================
//  Seeder - Flota vehicular
//  Ejecutar:  npx prisma migrate reset   (borra, migra y siembra)
//        o:   npx prisma db seed
//  Los datos son coherentes entre sí: estados de órdenes, estados de
//  vehículos, historial, stock y costos cuadran.
// =====================================================================
require("dotenv/config");
const bcrypt = require("bcryptjs");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("../src/generated/prisma/client");

const url = new URL(process.env.DATABASE_URL!);
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port || 3306),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

// Contraseña de prueba para todos los usuarios sembrados
const SEED_PASSWORD = process.env.SEED_PASSWORD ?? "Flota2026*";

const fecha = (s: string) => new Date(s);

async function limpiar() {
  // Orden inverso a las dependencias (solo para poder re-ejecutar el seeder)
  await prisma.historialEstadoOrden.deleteMany();
  await prisma.historialEstadoActivo.deleteMany();
  await prisma.ordenRepuesto.deleteMany();
  await prisma.ordenTecnico.deleteMany();
  await prisma.ordenMantenimiento.deleteMany();
  await prisma.tipoMantenimiento.deleteMany();
  await prisma.repuestoProveedor.deleteMany();
  await prisma.repuesto.deleteMany();
  await prisma.proveedor.deleteMany();
  await prisma.tecnicoEspecialidad.deleteMany();
  await prisma.tecnico.deleteMany();
  await prisma.especialidad.deleteMany();
  await prisma.activo.deleteMany();
  await prisma.categoriaActivo.deleteMany();
  await prisma.modelo.deleteMany();
  await prisma.marca.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.rol.deleteMany();
  await prisma.estadoActivo.deleteMany();
  await prisma.estadoOrden.deleteMany();
  await prisma.claseMantenimiento.deleteMany();
  await prisma.prioridad.deleteMany();
  await prisma.nivelCriticidad.deleteMany();
  await prisma.tipoCombustible.deleteMany();
  await prisma.unidadMedida.deleteMany();
  await prisma.nivelCertificacion.deleteMany();
}

async function main() {
  await limpiar();

  // ------------------------------------------------------------------
  // Catálogos (IDs fijos)
  // ------------------------------------------------------------------
  await prisma.estadoActivo.createMany({
    data: [
      { id: 1, nombre: "Operativo", descripcion: "Vehículo disponible para circular" },
      { id: 2, nombre: "En Mantenimiento", descripcion: "Automático: tiene una orden En Ejecución o En Espera de Repuesto" },
      { id: 3, nombre: "Fuera de Servicio", descripcion: "Acción administrativa: no puede circular temporalmente" },
      { id: 4, nombre: "Dado de Baja", descripcion: "Acción administrativa: baja lógica definitiva" },
    ],
  });

  await prisma.estadoOrden.createMany({
    data: [
      { id: 1, nombre: "Solicitada", descripcion: "Orden registrada por el solicitante" },
      { id: 2, nombre: "Diagnosticada", descripcion: "Viabilidad, alcance y prioridad definidos" },
      { id: 3, nombre: "Aprobada", descripcion: "Aprobada con fecha programada" },
      { id: 4, nombre: "Rechazada", descripcion: "Rechazada tras el diagnóstico (final)" },
      { id: 5, nombre: "En Ejecución", descripcion: "Trabajo en curso, vehículo En Mantenimiento" },
      { id: 6, nombre: "En Espera de Repuesto", descripcion: "Detenida por falta de stock" },
      { id: 7, nombre: "Completada", descripcion: "Trabajo finalizado y costo total calculado (final)" },
      { id: 8, nombre: "Cancelada", descripcion: "Cancelada antes del cierre (final)" },
    ],
  });

  await prisma.claseMantenimiento.createMany({
    data: [
      { id: 1, nombre: "Preventivo", descripcion: "Programado según el kilometraje recorrido" },
      { id: 2, nombre: "Correctivo", descripcion: "Reparación de una falla detectada" },
      { id: 3, nombre: "Emergencia", descripcion: "Atención inmediata; se permite aunque el vehículo esté En Mantenimiento" },
    ],
  });

  await prisma.prioridad.createMany({
    data: [
      { id: 1, nombre: "Baja", nivel: 1 },
      { id: 2, nombre: "Media", nivel: 2 },
      { id: 3, nombre: "Alta", nivel: 3 },
      { id: 4, nombre: "Crítica", nivel: 4 },
    ],
  });

  await prisma.nivelCriticidad.createMany({
    data: [
      { id: 1, nombre: "Baja", descripcion: "Uso administrativo, sin impacto en la operación" },
      { id: 2, nombre: "Media", descripcion: "Afecta rutas o entregas, existe vehículo de respaldo" },
      { id: 3, nombre: "Alta", descripcion: "Pasajeros o carga pesada: riesgo de seguridad vial" },
    ],
  });

  await prisma.tipoCombustible.createMany({
    data: [
      { id: 1, nombre: "Diésel" },
      { id: 2, nombre: "Gasolina" },
      { id: 3, nombre: "Eléctrico" },
      { id: 4, nombre: "Híbrido" },
    ],
  });

  await prisma.unidadMedida.createMany({
    data: [
      { id: 1, nombre: "Unidad", abreviatura: "und" },
      { id: 2, nombre: "Litro", abreviatura: "L" },
      { id: 3, nombre: "Juego", abreviatura: "jgo" },
      { id: 4, nombre: "Galón", abreviatura: "gal" },
    ],
  });

  await prisma.nivelCertificacion.createMany({
    data: [
      { id: 1, nombre: "Básico", nivel: 1 },
      { id: 2, nombre: "Intermedio", nivel: 2 },
      { id: 3, nombre: "Avanzado", nivel: 3 },
      { id: 4, nombre: "Experto", nivel: 4 },
    ],
  });

  // ------------------------------------------------------------------
  // Seguridad
  // ------------------------------------------------------------------
  await prisma.rol.createMany({
    data: [
      { id: 1, nombre: "Administrador", descripcion: "Gestión total del sistema" },
      { id: 2, nombre: "Coordinador/Técnico", descripcion: "Gestión operativa de órdenes de mantenimiento" },
      { id: 3, nombre: "Solicitante/Consulta", descripcion: "Crea solicitudes y consulta sus órdenes" },
    ],
  });

  const hash = await bcrypt.hash(SEED_PASSWORD, 10);
  await prisma.usuario.createMany({
    data: [
      { id: 1, rolId: 1, nombreCompleto: "Laura Méndez Solano", correo: "lmendez@flotacr.com", contrasenaHash: hash, fechaCreacion: fecha("2026-01-10T08:00:00"), ultimoAcceso: fecha("2026-09-27T07:45:00") },
      { id: 2, rolId: 1, nombreCompleto: "Andrés Vargas Quesada", correo: "avargas@flotacr.com", contrasenaHash: hash, fechaCreacion: fecha("2026-01-10T08:10:00"), ultimoAcceso: fecha("2026-09-25T16:20:00") },
      { id: 3, rolId: 2, nombreCompleto: "Carlos Jiménez Rojas", correo: "cjimenez@flotacr.com", contrasenaHash: hash, fechaCreacion: fecha("2026-01-12T09:00:00"), ultimoAcceso: fecha("2026-09-26T18:00:00") },
      { id: 4, rolId: 2, nombreCompleto: "Mario Solís Araya", correo: "msolis@flotacr.com", contrasenaHash: hash, fechaCreacion: fecha("2026-01-12T09:05:00"), ultimoAcceso: fecha("2026-09-24T12:00:00") },
      { id: 5, rolId: 2, nombreCompleto: "José Pablo Mora Castro", correo: "jmora@flotacr.com", contrasenaHash: hash, fechaCreacion: fecha("2026-01-12T09:10:00"), ultimoAcceso: fecha("2026-09-20T10:30:00") },
      { id: 6, rolId: 3, nombreCompleto: "Daniela Rojas Brenes", correo: "drojas@flotacr.com", contrasenaHash: hash, fechaCreacion: fecha("2026-01-15T10:00:00"), ultimoAcceso: fecha("2026-09-22T08:15:00") },
      { id: 7, rolId: 3, nombreCompleto: "Luis Fernando Chaves Mora", correo: "lchaves@flotacr.com", contrasenaHash: hash, fechaCreacion: fecha("2026-01-15T10:05:00"), ultimoAcceso: fecha("2026-09-26T09:00:00") },
      { id: 8, rolId: 3, nombreCompleto: "Sofía Alfaro Vega", correo: "salfaro@flotacr.com", contrasenaHash: hash, fechaCreacion: fecha("2026-01-15T10:10:00"), ultimoAcceso: fecha("2026-09-26T18:35:00") },
      { id: 9, rolId: 3, nombreCompleto: "Esteban Castro Ulate", correo: "ecastro@flotacr.com", contrasenaHash: hash, fechaCreacion: fecha("2026-01-15T10:15:00"), ultimoAcceso: fecha("2026-09-23T14:05:00") },
      { id: 10, rolId: 3, nombreCompleto: "Karla Núñez Pérez", correo: "knunez@flotacr.com", contrasenaHash: hash, activo: false, fechaCreacion: fecha("2026-01-15T10:20:00"), ultimoAcceso: fecha("2026-04-30T17:00:00") },
    ],
  });

  // ------------------------------------------------------------------
  // Marcas y modelos
  // ------------------------------------------------------------------
  await prisma.marca.createMany({
    data: [
      { id: 1, nombre: "Volvo" }, { id: 2, nombre: "Freightliner" }, { id: 3, nombre: "Isuzu" },
      { id: 4, nombre: "Hino" }, { id: 5, nombre: "Mercedes-Benz" }, { id: 6, nombre: "Toyota" },
      { id: 7, nombre: "Nissan" }, { id: 8, nombre: "Hyundai" },
    ],
  });

  await prisma.modelo.createMany({
    data: [
      { id: 1, marcaId: 1, nombre: "FH16" }, { id: 2, marcaId: 2, nombre: "Cascadia" },
      { id: 3, marcaId: 3, nombre: "NPR" }, { id: 4, marcaId: 4, nombre: "Serie 300" },
      { id: 5, marcaId: 5, nombre: "OF-1721" }, { id: 6, marcaId: 8, nombre: "County" },
      { id: 7, marcaId: 6, nombre: "Coaster" }, { id: 8, marcaId: 6, nombre: "Hilux" },
      { id: 9, marcaId: 7, nombre: "Frontier" }, { id: 10, marcaId: 6, nombre: "Corolla" },
      { id: 11, marcaId: 8, nombre: "Tucson" }, { id: 12, marcaId: 1, nombre: "9700" },
    ],
  });

  // ------------------------------------------------------------------
  // Categorías y vehículos
  // ------------------------------------------------------------------
  await prisma.categoriaActivo.createMany({
    data: [
      { id: 1, nombre: "Camión pesado", descripcion: "Carga mayor a 8 toneladas (prefijo CPE)", intervaloKm: 15000, margenAlertaKm: 1500 },
      { id: 2, nombre: "Camión liviano", descripcion: "Reparto urbano hasta 8 toneladas (prefijo CLV)", intervaloKm: 10000, margenAlertaKm: 1000 },
      { id: 3, nombre: "Autobús", descripcion: "Transporte de personal, más de 30 pasajeros (prefijo BUS)", intervaloKm: 12000, margenAlertaKm: 1200 },
      { id: 4, nombre: "Microbús", descripcion: "Transporte de personal hasta 30 pasajeros (prefijo MBS)", intervaloKm: 10000, margenAlertaKm: 1000 },
      { id: 5, nombre: "Pickup", descripcion: "Apoyo y supervisión de campo (prefijo PCK)", intervaloKm: 8000, margenAlertaKm: 800 },
      { id: 6, nombre: "Vehículo administrativo", descripcion: "Sedanes y SUV de uso administrativo (prefijo VAD)", intervaloKm: 7000, margenAlertaKm: 700 },
      { id: 7, nombre: "Motocicleta de mensajería", descripcion: "Categoría descontinuada (prefijo MOT)", intervaloKm: 4000, margenAlertaKm: 400, activo: false },
    ],
  });

  const registro = fecha("2026-01-15T09:00:00");
  await prisma.activo.createMany({
    data: [
      { id: 1, codigo: "CPE-0001", nombre: "Cabezal Volvo FH16 #1", descripcion: "Ruta de carga Limón - San José", placa: "C-165432", modeloId: 1, anio: 2021, tipoCombustibleId: 1, categoriaId: 1, nivelCriticidadId: 3, estadoActivoId: 1, fechaAdquisicion: fecha("2021-03-15"), valorReferencia: 78500000, kilometrajeRegistro: 140000, kilometrajeActual: 158200, imagenUrl: "uploads/activos/cpe-0001.jpg", fechaCreacion: registro },
      { id: 2, codigo: "CPE-0002", nombre: "Cabezal Freightliner Cascadia", descripcion: "Ruta de carga Caldera - Cartago", placa: "C-178901", modeloId: 2, anio: 2021, tipoCombustibleId: 1, categoriaId: 1, nivelCriticidadId: 3, estadoActivoId: 1, fechaAdquisicion: fecha("2021-08-02"), valorReferencia: 72000000, kilometrajeRegistro: 90000, kilometrajeActual: 103900, imagenUrl: "uploads/activos/cpe-0002.jpg", fechaCreacion: registro },
      { id: 3, codigo: "CLV-0001", nombre: "Camión Isuzu NPR reparto", descripcion: "Reparto urbano Gran Área Metropolitana", placa: "C-150233", modeloId: 3, anio: 2022, tipoCombustibleId: 1, categoriaId: 2, nivelCriticidadId: 2, estadoActivoId: 2, fechaAdquisicion: fecha("2022-02-10"), valorReferencia: 32000000, kilometrajeRegistro: 60000, kilometrajeActual: 64500, imagenUrl: "uploads/activos/clv-0001.jpg", fechaCreacion: registro },
      { id: 4, codigo: "CLV-0002", nombre: "Camión Hino 300 reparto", descripcion: "Reparto zona norte", placa: "C-149870", modeloId: 4, anio: 2023, tipoCombustibleId: 1, categoriaId: 2, nivelCriticidadId: 2, estadoActivoId: 1, fechaAdquisicion: fecha("2023-01-20"), valorReferencia: 35500000, kilometrajeRegistro: 45000, kilometrajeActual: 51200, imagenUrl: "uploads/activos/clv-0002.jpg", fechaCreacion: registro },
      { id: 5, codigo: "BUS-0001", nombre: "Autobús Mercedes-Benz OF-1721", descripcion: "Transporte de personal turno nocturno", placa: "AB-6012", modeloId: 5, anio: 2019, tipoCombustibleId: 1, categoriaId: 3, nivelCriticidadId: 3, estadoActivoId: 2, fechaAdquisicion: fecha("2019-06-05"), valorReferencia: 58000000, kilometrajeRegistro: 200000, kilometrajeActual: 213500, imagenUrl: "uploads/activos/bus-0001.jpg", fechaCreacion: registro },
      { id: 6, codigo: "BUS-0002", nombre: "Autobús Volvo 9700", descripcion: "Ruta de personal Heredia - Alajuela", placa: "AB-6245", modeloId: 12, anio: 2022, tipoCombustibleId: 1, categoriaId: 3, nivelCriticidadId: 3, estadoActivoId: 1, fechaAdquisicion: fecha("2022-04-18"), valorReferencia: 95000000, kilometrajeRegistro: 80000, kilometrajeActual: 91300, imagenUrl: "uploads/activos/bus-0002.jpg", fechaCreacion: registro },
      { id: 7, codigo: "MBS-0001", nombre: "Microbús Hyundai County", descripcion: "Transporte de técnicos de campo", placa: "AB-5890", modeloId: 6, anio: 2021, tipoCombustibleId: 1, categoriaId: 4, nivelCriticidadId: 2, estadoActivoId: 1, fechaAdquisicion: fecha("2021-11-11"), valorReferencia: 41000000, kilometrajeRegistro: 30000, kilometrajeActual: 36100, imagenUrl: "uploads/activos/mbs-0001.jpg", fechaCreacion: registro },
      { id: 8, codigo: "PCK-0001", nombre: "Pickup Toyota Hilux 4x4", descripcion: "Supervisión de rutas", placa: "BRT-452", modeloId: 8, anio: 2023, tipoCombustibleId: 1, categoriaId: 5, nivelCriticidadId: 2, estadoActivoId: 1, fechaAdquisicion: fecha("2023-03-01"), valorReferencia: 27500000, kilometrajeRegistro: 50000, kilometrajeActual: 58900, imagenUrl: "uploads/activos/pck-0001.jpg", fechaCreacion: registro },
      { id: 9, codigo: "PCK-0002", nombre: "Pickup Nissan Frontier", descripcion: "Apoyo de mantenimiento en carretera", placa: "CLM-783", modeloId: 9, anio: 2022, tipoCombustibleId: 1, categoriaId: 5, nivelCriticidadId: 2, estadoActivoId: 3, fechaAdquisicion: fecha("2022-05-25"), valorReferencia: 24000000, kilometrajeRegistro: 70000, kilometrajeActual: 74000, imagenUrl: "uploads/activos/pck-0002.jpg", fechaCreacion: registro },
      { id: 10, codigo: "VAD-0001", nombre: "Toyota Corolla administrativo", descripcion: "Uso de gerencia", placa: "BGS-310", modeloId: 10, anio: 2023, tipoCombustibleId: 2, categoriaId: 6, nivelCriticidadId: 1, estadoActivoId: 1, fechaAdquisicion: fecha("2023-07-14"), valorReferencia: 16500000, kilometrajeRegistro: 20000, kilometrajeActual: 25400, imagenUrl: "uploads/activos/vad-0001.jpg", fechaCreacion: registro },
      { id: 11, codigo: "VAD-0002", nombre: "Hyundai Tucson administrativo", descripcion: "Uso de jefaturas", placa: "BHK-921", modeloId: 11, anio: 2020, tipoCombustibleId: 2, categoriaId: 6, nivelCriticidadId: 1, estadoActivoId: 4, fechaAdquisicion: fecha("2020-09-09"), valorReferencia: 18000000, kilometrajeRegistro: 110000, kilometrajeActual: 118000, imagenUrl: "uploads/activos/vad-0002.jpg", fechaCreacion: registro },
      { id: 12, codigo: "MBS-0002", nombre: "Microbús Toyota Coaster", descripcion: "Transporte de personal administrativo", placa: "AB-6310", modeloId: 7, anio: 2024, tipoCombustibleId: 1, categoriaId: 4, nivelCriticidadId: 2, estadoActivoId: 1, fechaAdquisicion: fecha("2024-02-02"), valorReferencia: 52000000, kilometrajeRegistro: 15000, kilometrajeActual: 27200, imagenUrl: "uploads/activos/mbs-0002.jpg", fechaCreacion: registro },
    ],
  });

  // ------------------------------------------------------------------
  // Especialidades y técnicos
  // ------------------------------------------------------------------
  await prisma.especialidad.createMany({
    data: [
      { id: 1, nombre: "Mecánica de motores diésel", descripcion: "Motores diésel de carga y transporte" },
      { id: 2, nombre: "Mecánica de motores gasolina", descripcion: "Motores de gasolina de vehículos livianos" },
      { id: 3, nombre: "Electricidad automotriz", descripcion: "Baterías, alternadores, arranque y sensores" },
      { id: 4, nombre: "Frenos y suspensión", descripcion: "Frenos de aire, hidráulicos y suspensión" },
      { id: 5, nombre: "Transmisión y embrague", descripcion: "Cajas de cambio, diferenciales y embragues" },
      { id: 6, nombre: "Aire acondicionado vehicular", descripcion: "Compresores, recarga de gas y climatización" },
      { id: 7, nombre: "Llantas y alineamiento", descripcion: "Montaje, balanceo y alineación" },
      { id: 8, nombre: "Carrocería y pintura", descripcion: "Enderezado, soldadura y pintura" },
      { id: 9, nombre: "Sistemas GPS y telemetría", descripcion: "Servicio tercerizado, ya no se realiza en taller", activo: false },
    ],
  });

  await prisma.tecnico.createMany({
    data: [
      { id: 1, identificacion: "1-1234-0567", nombreCompleto: "Mario Solís Araya", telefono: "8811-2233", correo: "tec.msolis@flotacr.com", tarifaHora: 9500 },
      { id: 2, identificacion: "1-1456-0789", nombreCompleto: "José Pablo Mora Castro", telefono: "8822-3344", correo: "tec.jmora@flotacr.com", tarifaHora: 9000 },
      { id: 3, identificacion: "2-0678-0123", nombreCompleto: "Ricardo Salas Fonseca", telefono: "8833-4455", correo: "tec.rsalas@flotacr.com", tarifaHora: 11000 },
      { id: 4, identificacion: "3-0456-0987", nombreCompleto: "Gabriel Umaña León", telefono: "8844-5566", correo: "tec.gumana@flotacr.com", tarifaHora: 8500 },
      { id: 5, identificacion: "1-1122-0334", nombreCompleto: "Fabián Cordero Picado", telefono: "8855-6677", correo: "tec.fcordero@flotacr.com", tarifaHora: 10500 },
      { id: 6, identificacion: "4-0199-0456", nombreCompleto: "Marco Vinicio Arias Soto", telefono: "8866-7788", correo: "tec.marias@flotacr.com", tarifaHora: 8000 },
      { id: 7, identificacion: "1-1567-0890", nombreCompleto: "Allan Brenes Herrera", telefono: "8877-8899", correo: "tec.abrenes@flotacr.com", tarifaHora: 12000 },
      { id: 8, identificacion: "2-0789-0654", nombreCompleto: "Kevin Monge Calderón", telefono: "8888-9900", correo: "tec.kmonge@flotacr.com", tarifaHora: 7500, disponible: false },
      { id: 9, identificacion: "5-0321-0987", nombreCompleto: "Óscar Zúñiga Madrigal", telefono: "8899-0011", correo: "tec.ozuniga@flotacr.com", tarifaHora: 9000 },
      { id: 10, identificacion: "6-0234-0543", nombreCompleto: "Jeffrey Sánchez Loría", telefono: "8800-1122", correo: "tec.jsanchez@flotacr.com", tarifaHora: 8000, disponible: false },
    ],
  });

  const cert = (tecnicoId: number, especialidadId: number, nivelCertificacionId: number, f: string) =>
    ({ tecnicoId, especialidadId, nivelCertificacionId, fechaCertificacion: fecha(f) });
  await prisma.tecnicoEspecialidad.createMany({
    data: [
      cert(1, 1, 4, "2015-02-10"), cert(1, 5, 3, "2018-06-01"),
      cert(2, 2, 3, "2017-03-15"), cert(2, 3, 2, "2020-01-20"),
      cert(3, 3, 4, "2012-08-05"), cert(3, 6, 3, "2016-04-11"),
      cert(4, 4, 3, "2016-09-30"), cert(4, 7, 2, "2019-11-02"),
      cert(5, 1, 3, "2014-05-19"), cert(5, 4, 4, "2013-07-07"),
      cert(6, 7, 3, "2018-02-14"), cert(6, 8, 1, "2022-03-03"),
      cert(7, 1, 4, "2010-01-12"), cert(7, 5, 4, "2011-10-10"), cert(7, 2, 3, "2015-05-05"),
      cert(8, 8, 2, "2019-08-08"), cert(8, 6, 1, "2023-01-16"),
      cert(9, 6, 4, "2014-12-01"), cert(9, 3, 3, "2017-09-09"),
      cert(10, 2, 2, "2021-04-04"), cert(10, 4, 1, "2023-06-06"),
    ],
  });

  // ------------------------------------------------------------------
  // Repuestos y proveedores (stock ya refleja los usos registrados)
  // ------------------------------------------------------------------
  await prisma.repuesto.createMany({
    data: [
      { id: 1, codigo: "REP-0001", nombre: "Filtro de aceite diésel pesado", descripcion: "Volvo / Freightliner / Coaster", unidadMedidaId: 1, stockActual: 25, stockMinimo: 10 },
      { id: 2, codigo: "REP-0002", nombre: "Aceite de motor 15W-40", descripcion: "Aceite mineral para motor diésel", unidadMedidaId: 4, stockActual: 40, stockMinimo: 20 },
      { id: 3, codigo: "REP-0003", nombre: "Filtro de aire motor diésel", descripcion: "Elemento filtrante primario", unidadMedidaId: 1, stockActual: 12, stockMinimo: 6 },
      { id: 4, codigo: "REP-0004", nombre: "Pastillas de freno delanteras", descripcion: "Juego para eje delantero", unidadMedidaId: 3, stockActual: 8, stockMinimo: 6 },
      { id: 5, codigo: "REP-0005", nombre: "Tambor de freno trasero", descripcion: "Eje trasero de carga", unidadMedidaId: 1, stockActual: 3, stockMinimo: 4 },
      { id: 6, codigo: "REP-0006", nombre: "Batería 12V 200Ah", descripcion: "Batería de ciclo pesado", unidadMedidaId: 1, stockActual: 5, stockMinimo: 3 },
      { id: 7, codigo: "REP-0007", nombre: "Alternador 24V", descripcion: "Camión pesado y autobús", unidadMedidaId: 1, stockActual: 1, stockMinimo: 2 },
      { id: 8, codigo: "REP-0008", nombre: "Kit de embrague pesado", descripcion: "Disco, prensa y collarín", unidadMedidaId: 3, stockActual: 0, stockMinimo: 2 },
      { id: 9, codigo: "REP-0009", nombre: "Gas refrigerante R134a", descripcion: "Cilindro de 13.6 kg", unidadMedidaId: 1, stockActual: 6, stockMinimo: 4 },
      { id: 10, codigo: "REP-0010", nombre: "Llanta 295/80R22.5", descripcion: "Radial para camión y autobús", unidadMedidaId: 1, stockActual: 10, stockMinimo: 12 },
      { id: 11, codigo: "REP-0011", nombre: "Aceite de transmisión 80W-90", descripcion: "Caja y diferencial", unidadMedidaId: 2, stockActual: 30, stockMinimo: 15 },
      { id: 12, codigo: "REP-0012", nombre: "Filtro de combustible diésel", descripcion: "Separador de agua", unidadMedidaId: 1, stockActual: 18, stockMinimo: 8 },
      { id: 13, codigo: "REP-0013", nombre: "Carburador motocicleta 150cc", descripcion: "Descontinuado junto con la categoría de motos", unidadMedidaId: 1, stockActual: 2, stockMinimo: 0, activo: false },
    ],
  });

  await prisma.proveedor.createMany({
    data: [
      { id: 1, cedulaJuridica: "3-101-456789", nombre: "Distribuidora Automotriz del Valle S.A.", contacto: "Marcela Quirós", telefono: "2233-4455", correo: "ventas@autovalle.cr", direccion: "San José, La Uruca", condicionesGenerales: "Crédito 30 días, entrega en GAM sin costo" },
      { id: 2, cedulaJuridica: "3-101-567890", nombre: "Repuestos Pesados de Costa Rica S.A.", contacto: "Rodrigo Castillo", telefono: "2244-5566", correo: "pedidos@rpcr.cr", direccion: "Alajuela, El Coyol", condicionesGenerales: "Crédito 45 días, garantía 6 meses" },
      { id: 3, cedulaJuridica: "3-101-678901", nombre: "Frenos y Embragues Centroamericanos S.A.", contacto: "Patricia Solano", telefono: "2255-6677", correo: "info@frenoscentro.cr", direccion: "Cartago, Taras", condicionesGenerales: "Contado, 5% de descuento por volumen" },
      { id: 4, cedulaJuridica: "3-102-789012", nombre: "Baterías y Eléctricos El Rayo Ltda.", contacto: "Jorge Ramírez", telefono: "2266-7788", correo: "ventas@elrayo.cr", direccion: "Heredia, Barreal", condicionesGenerales: "Crédito 15 días, garantía 12 meses en baterías" },
      { id: 5, cedulaJuridica: "3-101-890123", nombre: "Llantas del Pacífico S.A.", contacto: "Ana Lucía Rojas", telefono: "2277-8899", correo: "llantas@delpacifico.cr", direccion: "Puntarenas, Barranca", condicionesGenerales: "Contado, incluye montaje y balanceo" },
      { id: 6, cedulaJuridica: "3-101-901234", nombre: "Lubricantes Nacionales S.A.", contacto: "Mauricio Herrera", telefono: "2288-9900", correo: "pedidos@lubrinac.cr", direccion: "San José, Pavas", condicionesGenerales: "Crédito 30 días, entrega en 24 h" },
      { id: 7, cedulaJuridica: "3-101-012345", nombre: "Importadora Diesel Tech S.A.", contacto: "Silvia Montero", telefono: "2299-0011", correo: "contacto@dieseltech.cr", direccion: "Alajuela, Río Segundo", condicionesGenerales: "Crédito 60 días, importación directa" },
      { id: 8, cedulaJuridica: "3-102-123456", nombre: "Clima Auto Refrigeración S.R.L.", contacto: "Esteban Mora", telefono: "2200-1122", correo: "servicio@climaauto.cr", direccion: "Heredia, San Francisco", condicionesGenerales: "Contado, garantía 3 meses" },
      { id: 9, cedulaJuridica: "3-101-234567", nombre: "Motorepuestos La Sabana S.A.", contacto: "Rolando Vega", telefono: "2211-3344", correo: "ventas@motosabana.cr", direccion: "San José, La Sabana", condicionesGenerales: "Proveedor inactivo: cerró operaciones", activo: false },
    ],
  });

  const oferta = (repuestoId: number, proveedorId: number, precio: number, tiempoEntregaDias: number) =>
    ({ repuestoId, proveedorId, precio, tiempoEntregaDias });
  await prisma.repuestoProveedor.createMany({
    data: [
      oferta(1, 1, 8500, 2), oferta(1, 7, 7800, 5), oferta(1, 2, 8200, 3),
      oferta(2, 6, 14500, 1), oferta(2, 1, 15800, 2),
      oferta(3, 1, 12500, 2), oferta(3, 7, 11900, 6),
      oferta(4, 3, 38000, 3), oferta(4, 2, 41000, 1),
      oferta(5, 3, 65000, 7), oferta(5, 2, 69500, 4),
      oferta(6, 4, 145000, 2), oferta(6, 1, 152000, 1),
      oferta(7, 4, 285000, 10), oferta(7, 7, 269000, 15),
      oferta(8, 3, 420000, 12), oferta(8, 2, 455000, 6),
      oferta(9, 8, 32000, 2), oferta(9, 4, 35000, 3),
      oferta(10, 5, 165000, 4), oferta(10, 2, 172000, 2),
      oferta(11, 6, 5200, 1), oferta(11, 1, 5900, 2),
      oferta(12, 7, 9800, 3), oferta(12, 2, 10400, 2),
      oferta(13, 9, 18000, 5),
    ],
  });

  // ------------------------------------------------------------------
  // Tipos de mantenimiento (clase + especialidad requerida)
  // ------------------------------------------------------------------
  await prisma.tipoMantenimiento.createMany({
    data: [
      { id: 1, nombre: "Preventivo motor diésel", descripcion: "Aceite, filtros y revisión general por kilometraje", claseMantenimientoId: 1, especialidadId: 1 },
      { id: 2, nombre: "Preventivo motor gasolina", descripcion: "Aceite, filtros y revisión general por kilometraje", claseMantenimientoId: 1, especialidadId: 2 },
      { id: 3, nombre: "Correctivo motor diésel", descripcion: "Reparación de fallas del motor diésel", claseMantenimientoId: 2, especialidadId: 1 },
      { id: 4, nombre: "Correctivo sistema eléctrico", descripcion: "Baterías, alternador, arranque y sensores", claseMantenimientoId: 2, especialidadId: 3 },
      { id: 5, nombre: "Correctivo frenos y suspensión", descripcion: "Pastillas, tambores, líneas de aire y amortiguadores", claseMantenimientoId: 2, especialidadId: 4 },
      { id: 6, nombre: "Correctivo transmisión y embrague", descripcion: "Caja, diferencial o embrague", claseMantenimientoId: 2, especialidadId: 5 },
      { id: 7, nombre: "Correctivo aire acondicionado", descripcion: "Reparación y recarga del A/C", claseMantenimientoId: 2, especialidadId: 6 },
      { id: 8, nombre: "Correctivo llantas y alineamiento", descripcion: "Sustitución de llantas, balanceo y alineación", claseMantenimientoId: 2, especialidadId: 7 },
      { id: 9, nombre: "Reparación de carrocería", descripcion: "Enderezado y pintura por colisión o corrosión", claseMantenimientoId: 2, especialidadId: 8 },
      { id: 10, nombre: "Emergencia motor en carretera", descripcion: "Atención inmediata de falla de motor en ruta", claseMantenimientoId: 3, especialidadId: 1 },
      { id: 11, nombre: "Emergencia sistema de frenos", descripcion: "Atención inmediata de falla de frenos", claseMantenimientoId: 3, especialidadId: 4 },
      { id: 12, nombre: "Preventivo motocicleta", descripcion: "Descontinuado junto con la categoría de motos", claseMantenimientoId: 1, especialidadId: 2, activo: false },
    ],
  });

  // ------------------------------------------------------------------
  // Órdenes de mantenimiento (una o más en cada estado)
  // ------------------------------------------------------------------
  await prisma.ordenMantenimiento.createMany({
    data: [
      { id: 1, codigo: "OM-2026-0001", activoId: 1, tipoMantenimientoId: 1, prioridadId: 2, estadoOrdenId: 7, usuarioSolicitanteId: 6, motivo: "Mantenimiento preventivo por kilometraje", diagnostico: "Servicio de 15 000 km: aceite y filtros", kilometrajeAlSolicitar: 148500, fechaSolicitud: fecha("2026-07-01T08:00:00"), fechaProgramada: fecha("2026-07-06"), fechaInicio: fecha("2026-07-06T07:30:00"), fechaCierre: fecha("2026-07-07T16:00:00"), costoTotal: 280600 },
      { id: 2, codigo: "OM-2026-0002", activoId: 2, tipoMantenimientoId: 5, prioridadId: 3, estadoOrdenId: 7, usuarioSolicitanteId: 7, motivo: "Ruido metálico y pérdida de frenado en eje trasero", diagnostico: "Desgaste severo de tambores traseros y pastillas delanteras", kilometrajeAlSolicitar: 101200, fechaSolicitud: fecha("2026-07-20T09:15:00"), fechaProgramada: fecha("2026-07-22"), fechaInicio: fecha("2026-07-22T08:00:00"), fechaCierre: fecha("2026-07-23T15:30:00"), costoTotal: 316000 },
      { id: 3, codigo: "OM-2026-0003", activoId: 3, tipoMantenimientoId: 4, prioridadId: 3, estadoOrdenId: 5, usuarioSolicitanteId: 8, motivo: "El camión no enciende por las mañanas", diagnostico: "Batería sin capacidad de carga, revisar alternador", kilometrajeAlSolicitar: 64500, fechaSolicitud: fecha("2026-09-20T10:00:00"), fechaProgramada: fecha("2026-09-24"), fechaInicio: fecha("2026-09-24T08:00:00") },
      { id: 4, codigo: "OM-2026-0004", activoId: 5, tipoMantenimientoId: 6, prioridadId: 4, estadoOrdenId: 6, usuarioSolicitanteId: 6, motivo: "El embrague patina en cambios altos con carga completa", diagnostico: "Kit de embrague desgastado, requiere sustitución", kilometrajeAlSolicitar: 213500, fechaSolicitud: fecha("2026-09-10T07:00:00"), fechaProgramada: fecha("2026-09-15"), fechaInicio: fecha("2026-09-15T08:00:00") },
      { id: 5, codigo: "OM-2026-0005", activoId: 6, tipoMantenimientoId: 1, prioridadId: 2, estadoOrdenId: 3, usuarioSolicitanteId: 1, motivo: "Alerta de mantenimiento preventivo próximo a vencer", diagnostico: "Servicio preventivo de 12 000 km", kilometrajeAlSolicitar: 91300, fechaSolicitud: fecha("2026-09-22T08:00:00"), fechaProgramada: fecha("2026-09-30") },
      { id: 6, codigo: "OM-2026-0006", activoId: 7, tipoMantenimientoId: 7, prioridadId: 1, estadoOrdenId: 2, usuarioSolicitanteId: 9, motivo: "El aire acondicionado no enfría", diagnostico: "Fuga menor en compresor, requiere recarga de R134a", kilometrajeAlSolicitar: 36100, fechaSolicitud: fecha("2026-09-23T14:00:00") },
      { id: 7, codigo: "OM-2026-0007", activoId: 8, tipoMantenimientoId: 1, estadoOrdenId: 1, usuarioSolicitanteId: 7, motivo: "El kilometraje superó el intervalo de mantenimiento preventivo", kilometrajeAlSolicitar: 58900, fechaSolicitud: fecha("2026-09-26T09:00:00") },
      { id: 8, codigo: "OM-2026-0008", activoId: 9, tipoMantenimientoId: 9, prioridadId: 1, estadoOrdenId: 4, usuarioSolicitanteId: 8, motivo: "Corrosión visible en el chasis", diagnostico: "Daño estructural en chasis, reparación no rentable", kilometrajeAlSolicitar: 74000, fechaSolicitud: fecha("2026-08-05T11:00:00"), fechaCierre: fecha("2026-08-07T10:00:00") },
      { id: 9, codigo: "OM-2026-0009", activoId: 10, tipoMantenimientoId: 2, prioridadId: 1, estadoOrdenId: 8, usuarioSolicitanteId: 9, motivo: "Servicio preventivo de rutina", diagnostico: "Servicio preventivo de 5 000 km", kilometrajeAlSolicitar: 25000, fechaSolicitud: fecha("2026-08-15T08:30:00"), fechaProgramada: fecha("2026-08-21"), fechaCierre: fecha("2026-08-20T11:00:00") },
      { id: 10, codigo: "OM-2026-0010", activoId: 4, tipoMantenimientoId: 8, prioridadId: 2, estadoOrdenId: 7, usuarioSolicitanteId: 6, motivo: "Llantas traseras lisas", diagnostico: "Banda de rodamiento bajo el mínimo legal en 4 llantas", kilometrajeAlSolicitar: 49800, fechaSolicitud: fecha("2026-06-10T10:00:00"), fechaProgramada: fecha("2026-06-12"), fechaInicio: fecha("2026-06-12T08:00:00"), fechaCierre: fecha("2026-06-12T17:00:00"), costoTotal: 742500 },
      { id: 11, codigo: "OM-2026-0011", activoId: 3, tipoMantenimientoId: 11, estadoOrdenId: 1, usuarioSolicitanteId: 8, motivo: "Durante la reparación eléctrica se detectó fuga en la línea de freno", kilometrajeAlSolicitar: 64500, fechaSolicitud: fecha("2026-09-26T18:30:00") },
      { id: 12, codigo: "OM-2026-0012", activoId: 12, tipoMantenimientoId: 1, prioridadId: 2, estadoOrdenId: 7, usuarioSolicitanteId: 6, motivo: "Mantenimiento preventivo por kilometraje", diagnostico: "Servicio de 10 000 km", kilometrajeAlSolicitar: 25000, fechaSolicitud: fecha("2026-08-25T09:00:00"), fechaProgramada: fecha("2026-08-28"), fechaInicio: fecha("2026-08-28T07:00:00"), fechaCierre: fecha("2026-08-28T15:00:00"), costoTotal: 97800 },
    ],
  });

  // Repuestos usados (detalle). Orden 4: el kit de embrague quedó pendiente.
  const uso = (ordenId: number, repuestoId: number, proveedorId: number, cantidad: number, costoUnitario: number, f: string, pendiente = false) =>
    ({ ordenId, repuestoId, proveedorId, cantidad, costoUnitario, pendiente, fechaRegistro: fecha(f) });
  await prisma.ordenRepuesto.createMany({
    data: [
      uso(1, 1, 7, 2, 7800, "2026-07-07T10:00:00"),
      uso(1, 2, 6, 10, 14500, "2026-07-07T10:00:00"),
      uso(1, 3, 7, 1, 11900, "2026-07-07T10:05:00"),
      uso(1, 12, 7, 2, 9800, "2026-07-07T10:05:00"),
      uso(2, 4, 3, 2, 38000, "2026-07-23T10:00:00"),
      uso(2, 5, 3, 2, 65000, "2026-07-23T10:00:00"),
      uso(3, 6, 4, 1, 145000, "2026-09-24T11:00:00"),
      uso(4, 11, 6, 8, 5200, "2026-09-16T09:00:00"),
      uso(4, 8, 3, 1, 420000, "2026-09-16T10:30:00", true),
      uso(10, 10, 5, 4, 165000, "2026-06-12T12:00:00"),
      uso(12, 1, 1, 1, 8500, "2026-08-28T10:00:00"),
      uso(12, 2, 6, 3, 14500, "2026-08-28T10:00:00"),
      uso(12, 12, 7, 1, 9800, "2026-08-28T10:05:00"),
    ],
  });

  // Técnicos asignados (todos poseen la especialidad que exige el tipo)
  const asig = (ordenId: number, tecnicoId: number, f: string, horasTrabajadas: number, tarifaHoraAplicada: number) =>
    ({ ordenId, tecnicoId, fechaAsignacion: fecha(f), horasTrabajadas, tarifaHoraAplicada });
  await prisma.ordenTecnico.createMany({
    data: [
      asig(1, 1, "2026-07-06T07:30:00", 6, 9500),
      asig(1, 5, "2026-07-06T07:30:00", 3, 10500),
      asig(2, 4, "2026-07-22T08:00:00", 8, 8500),
      asig(2, 5, "2026-07-22T08:00:00", 4, 10500),
      asig(3, 3, "2026-09-24T08:00:00", 5, 11000),
      asig(3, 9, "2026-09-24T08:00:00", 3, 9000),
      asig(4, 7, "2026-09-15T08:00:00", 6, 12000),
      asig(4, 1, "2026-09-15T08:00:00", 4, 9500),
      asig(10, 4, "2026-06-12T08:00:00", 5, 8500),
      asig(10, 6, "2026-06-12T08:00:00", 5, 8000),
      asig(12, 7, "2026-08-28T07:00:00", 3, 12000),
    ],
  });

  // ------------------------------------------------------------------
  // Historial de estados de las órdenes
  // ------------------------------------------------------------------
  const ho = (ordenId: number, estadoAnteriorId: number | null, estadoNuevoId: number, f: string, usuarioId: number, observacion?: string) =>
    ({ ordenId, estadoAnteriorId, estadoNuevoId, fechaCambio: fecha(f), usuarioId, observacion });
  await prisma.historialEstadoOrden.createMany({
    data: [
      ho(1, null, 1, "2026-07-01T08:00:00", 6, "Solicitud por kilometraje"),
      ho(1, 1, 2, "2026-07-02T09:00:00", 3, "Mantenimiento preventivo de 15 000 km"),
      ho(1, 2, 3, "2026-07-02T11:00:00", 1),
      ho(1, 3, 5, "2026-07-06T07:30:00", 3),
      ho(1, 5, 7, "2026-07-07T16:00:00", 3, "Trabajo finalizado sin novedades"),
      ho(2, null, 1, "2026-07-20T09:15:00", 7),
      ho(2, 1, 2, "2026-07-20T14:00:00", 3, "Desgaste severo de tambores traseros"),
      ho(2, 2, 3, "2026-07-21T08:30:00", 1),
      ho(2, 3, 5, "2026-07-22T08:00:00", 3),
      ho(2, 5, 7, "2026-07-23T15:30:00", 3),
      ho(3, null, 1, "2026-09-20T10:00:00", 8),
      ho(3, 1, 2, "2026-09-21T09:00:00", 3, "Batería sin capacidad de carga"),
      ho(3, 2, 3, "2026-09-22T10:00:00", 1),
      ho(3, 3, 5, "2026-09-24T08:00:00", 3),
      ho(4, null, 1, "2026-09-10T07:00:00", 6),
      ho(4, 1, 2, "2026-09-10T13:00:00", 3, "Embrague desgastado"),
      ho(4, 2, 3, "2026-09-11T08:00:00", 1),
      ho(4, 3, 5, "2026-09-15T08:00:00", 3),
      ho(4, 5, 6, "2026-09-16T10:30:00", 3, "Sin stock de kit de embrague REP-0008"),
      ho(5, null, 1, "2026-09-22T08:00:00", 1, "Generada desde alerta de mantenimiento preventivo"),
      ho(5, 1, 2, "2026-09-22T13:00:00", 3),
      ho(5, 2, 3, "2026-09-23T09:00:00", 1, "Programada para el 30/09"),
      ho(6, null, 1, "2026-09-23T14:00:00", 9),
      ho(6, 1, 2, "2026-09-24T10:00:00", 3, "Fuga menor en compresor de A/C"),
      ho(7, null, 1, "2026-09-26T09:00:00", 7),
      ho(8, null, 1, "2026-08-05T11:00:00", 8),
      ho(8, 1, 2, "2026-08-06T09:00:00", 3, "Daño estructural en chasis"),
      ho(8, 2, 4, "2026-08-07T10:00:00", 1, "Reparación no rentable frente al valor del vehículo"),
      ho(9, null, 1, "2026-08-15T08:30:00", 9),
      ho(9, 1, 2, "2026-08-15T13:00:00", 3),
      ho(9, 2, 3, "2026-08-16T09:00:00", 1),
      ho(9, 3, 8, "2026-08-20T11:00:00", 1, "Vehículo reasignado a gira; se reprogramará"),
      ho(10, null, 1, "2026-06-10T10:00:00", 6),
      ho(10, 1, 2, "2026-06-10T15:00:00", 3, "Llantas bajo el mínimo legal"),
      ho(10, 2, 3, "2026-06-11T08:00:00", 1),
      ho(10, 3, 5, "2026-06-12T08:00:00", 3),
      ho(10, 5, 7, "2026-06-12T17:00:00", 3),
      ho(11, null, 1, "2026-09-26T18:30:00", 8, "Emergencia: permitida aunque el vehículo está En Mantenimiento"),
      ho(12, null, 1, "2026-08-25T09:00:00", 6),
      ho(12, 1, 2, "2026-08-25T14:00:00", 3),
      ho(12, 2, 3, "2026-08-26T08:00:00", 1),
      ho(12, 3, 5, "2026-08-28T07:00:00", 3),
      ho(12, 5, 7, "2026-08-28T15:00:00", 3),
    ],
  });

  // ------------------------------------------------------------------
  // Historial de estados de los vehículos
  // ------------------------------------------------------------------
  const ha = (activoId: number, estadoAnteriorId: number | null, estadoNuevoId: number, f: string, usuarioId: number, ordenId: number | null, observacion: string) =>
    ({ activoId, estadoAnteriorId, estadoNuevoId, fechaCambio: fecha(f), usuarioId, ordenId, observacion });
  await prisma.historialEstadoActivo.createMany({
    data: [
      ...Array.from({ length: 12 }, (_, i) => ha(i + 1, null, 1, "2026-01-15T09:00:00", 1, null, "Registro del vehículo")),
      ha(11, 1, 4, "2026-05-30T10:00:00", 1, null, "Pérdida total tras colisión"),
      ha(4, 1, 2, "2026-06-12T08:00:00", 3, 10, "Automático: orden En Ejecución"),
      ha(4, 2, 1, "2026-06-12T17:00:00", 3, 10, "Automático: orden Completada"),
      ha(1, 1, 2, "2026-07-06T07:30:00", 3, 1, "Automático: orden En Ejecución"),
      ha(1, 2, 1, "2026-07-07T16:00:00", 3, 1, "Automático: orden Completada"),
      ha(2, 1, 2, "2026-07-22T08:00:00", 3, 2, "Automático: orden En Ejecución"),
      ha(2, 2, 1, "2026-07-23T15:30:00", 3, 2, "Automático: orden Completada"),
      ha(9, 1, 3, "2026-08-08T09:00:00", 1, null, "Chasis dañado, reparación rechazada (OM-2026-0008)"),
      ha(12, 1, 2, "2026-08-28T07:00:00", 3, 12, "Automático: orden En Ejecución"),
      ha(12, 2, 1, "2026-08-28T15:00:00", 3, 12, "Automático: orden Completada"),
      ha(5, 1, 2, "2026-09-15T08:00:00", 3, 4, "Automático: orden En Ejecución"),
      ha(3, 1, 2, "2026-09-24T08:00:00", 3, 3, "Automático: orden En Ejecución"),
    ],
  });

  console.log("Seeder completado: flota vehicular lista.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

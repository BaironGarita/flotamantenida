const { test, before, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
process.env.LOG_LEVEL = 'silent';

// Aislar Prisma por completo: cualquier consulta no simulada falla sin abrir conexiones.
let methods = {};
const prisma = new Proxy({}, { get(_target, model) {
  return new Proxy({}, { get(_target, method) {
    return (...args) => {
      const fn = methods[`${model}.${method}`];
      if (!fn) throw new Error(`Consulta no simulada: ${model}.${method}`);
      return fn(...args);
    };
  } });
} });
const originalLoad = Module._load;
const config = path.resolve(__dirname, '../dist/config/prisma.js');
Module._load = function(request, parent, isMain) {
  if (Module._resolveFilename(request, parent, isMain) === config) return { prisma };
  return originalLoad.apply(this, arguments);
};
const { app } = require('../dist/server');
const { elapsedYears } = require('../dist/utils/elapsed-years');
const schemas = require('../dist/dtos/catalog-crud.dto');
let server, base;
before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = 'http://127.0.0.1:' + server.address().port;
});
beforeEach(() => { methods = {}; });
after(async () => {
  await new Promise(resolve => server.close(resolve));
  Module._load = originalLoad;
});
async function request(route, method = 'GET', body) {
  const response = await fetch(base + route, { method, ...(body === undefined ? {} : {
    headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  }) });
  return { status: response.status, body: await response.json() };
}
function category(count) {
  methods['categoriaActivo.findUnique'] = async () => ({ id: 1, activo: true, _count: { activos: count } });
  methods['categoriaActivo.update'] = async ({ data }) => ({ id: 1, ...data, _count: { activos: count } });
}
function vehicle() {
  methods['activo.findUnique'] = async () => ({ id: 1, estadoActivoId: 1, kilometrajeActual: 1000, kilometrajeRegistro: 500 });
  methods['estadoActivo.findUnique'] = async () => ({ id: 4 });
  methods['activo.update'] = async ({ data }) => ({ id: 1, ...data });
}
function technician() {
  return { id: 1, especialidades: [{ especialidadId: 1, fechaCertificacion: new Date('2020-01-01'),
    especialidad: { id: 1, nombre: 'Mecánica' }, nivelCertificacion: { id: 1, nombre: 'Básico' },
  }] };
}
test('categorías: DELETE bloquea activos asociados', async () => {
  category(2);
  assert.equal((await request('/categoriaActivo/1', 'DELETE')).status, 409);
});
test('categorías: PUT no permite saltarse la protección con activo=false', async () => {
  category(2);
  assert.equal((await request('/categoriaActivo/1', 'PUT', { activo: false })).status, 409);
});
test('categorías: PUT permite desactivar sin activos asociados', async () => {
  category(0);
  const result = await request('/categoriaActivo/1', 'PUT', { activo: false });
  assert.equal(result.status, 200);
  assert.equal(result.body.data.activo, false);
});
test('categorías: editar el nombre conserva los activos y devuelve su cantidad', async () => {
  category(2);
  const result = await request('/categoriaActivo/1', 'PUT', { nombre: 'Carga pesada' });
  assert.equal(result.status, 200);
  assert.equal(result.body.data.cantidadActivos, 2);
});
test('categorías: actualización inexistente devuelve 404', async () => {
  methods['categoriaActivo.findUnique'] = async () => null;
  assert.equal((await request('/categoriaActivo/99', 'PUT', { activo: false })).status, 404);
});
test('técnicos: listado incluye cantidad y antigüedad sin perder las relaciones', async () => {
  methods['tecnico.findMany'] = async () => [technician()];
  const result = await request('/tecnico');
  assert.equal(result.status, 200);
  const data = result.body.data[0];
  assert.equal(data.cantidadEspecialidades, 1);
  assert.ok(Number.isInteger(data.especialidades[0].antiguedadAnios));
  assert.equal(data.especialidades[0].especialidad.nombre, 'Mecánica');
});
test('técnicos: detalle incluye antigüedad y certificación', async () => {
  methods['tecnico.findUnique'] = async () => technician();
  const result = await request('/tecnico/1');
  assert.equal(result.status, 200);
  assert.equal(result.body.data.cantidadEspecialidades, 1);
  assert.ok(Number.isInteger(result.body.data.especialidades[0].antiguedadAnios));
  assert.equal(result.body.data.especialidades[0].nivelCertificacion.nombre, 'Básico');
});
test('antigüedad: cuenta años completos antes y después del aniversario', () => {
  assert.equal(elapsedYears(new Date('2020-06-15'), new Date('2026-06-14')), 5);
  assert.equal(elapsedYears(new Date('2020-06-15'), new Date('2026-06-15')), 6);
  assert.equal(elapsedYears(new Date('2027-01-01'), new Date('2026-01-01')), 0);
});
test('antigüedad: certificación del 29 de febrero completa el año en marzo', () => {
  assert.equal(elapsedYears(new Date('2024-02-29'), new Date('2025-02-28')), 0);
  assert.equal(elapsedYears(new Date('2024-02-29'), new Date('2025-03-01')), 1);
});
test('baja lógica: rechaza órdenes asociadas aunque estén cerradas', async () => {
  vehicle();
  methods['ordenMantenimiento.count'] = async ({ where }) => {
    assert.deepEqual(where, { activoId: 1 });
    return 1;
  };
  assert.equal((await request('/activo/1/baja', 'PUT')).status, 409);
});
test('baja lógica: permite un vehículo sin órdenes', async () => {
  vehicle();
  methods['ordenMantenimiento.count'] = async () => 0;
  methods['activo.update'] = async ({ data }) => { assert.equal(data.estadoActivoId, 4); return { id: 1 }; };
  assert.equal((await request('/activo/1/baja', 'PUT')).status, 200);
});
test('baja lógica: vehículo inexistente devuelve 404', async () => {
  methods['activo.findUnique'] = async () => null;
  assert.equal((await request('/activo/1/baja', 'PUT')).status, 404);
});
test('estado administrativo: conserva el bloqueo de órdenes abiertas', async () => {
  vehicle();
  methods['ordenMantenimiento.count'] = async ({ where }) => {
    assert.deepEqual(where.estadoOrdenId.notIn, [4, 7, 8]);
    return 1;
  };
  assert.equal((await request('/activo/1/estado', 'PUT', { estadoActivoId: 3 })).status, 409);
});
test('tarifa: rechaza desbordamiento, negativos y exceso de decimales antes de escribir', async () => {
  for (const tarifaHora of [100000000, -1, 12.345]) {
    assert.equal((await request('/tecnico/1', 'PUT', { tarifaHora })).status, 400);
  }
});
test('precio: rechaza desbordamiento, negativos y exceso de decimales antes de escribir', async () => {
  for (const precio of [10000000000, -1, 12.345]) {
    assert.equal((await request('/repuesto/1/proveedores', 'POST', { proveedorId: 1, precio, tiempoEntregaDias: 1 })).status, 400);
  }
});
test('importes: acepta cero y los límites exactos de las columnas', () => {
  for (const tarifaHora of [0, 12.34, 99999999.99]) assert.equal(schemas.updateTecnicoSchema.safeParse({ tarifaHora }).success, true);
  for (const precio of [0, 12.34, 9999999999.99]) assert.equal(schemas.associateRepuestoProveedorSchema.safeParse({ proveedorId: 1, precio, tiempoEntregaDias: 1 }).success, true);
});
test('repuestos: rechaza stock negativo', () => {
  assert.equal(schemas.updateRepuestoSchema.safeParse({ stockActual: -1 }).success, false);
});
test('técnicos: asociar dos veces la misma especialidad devuelve 409', async () => {
  methods['tecnico.findUnique'] = async () => technician();
  methods['especialidad.findUnique'] = async () => ({ id: 1 });
  methods['nivelCertificacion.findUnique'] = async () => ({ id: 1 });
  methods['tecnicoEspecialidad.findUnique'] = async () => ({ tecnicoId: 1, especialidadId: 1 });
  assert.equal((await request('/tecnico/1/especialidades', 'POST', {
    especialidadId: 1, nivelCertificacionId: 1, fechaCertificacion: '2020-01-01',
  })).status, 409);
});
test('Postman: la solicitud CRUD de orden devuelve 201 y días calculados', async () => {
  const collection = JSON.parse(fs.readFileSync(path.join(__dirname, '../postman/Flota Mantenida.postman_collection.json'), 'utf8'));
  const folder = collection.item.find(item => item.name === 'Órdenes de Mantenimiento');
  const item = folder.item.find(item => item.name === 'Crear solicitud de mantenimiento CRUD');
  const body = JSON.parse(item.request.body.raw.replace(/\{\{[^}]+\}\}/g, '1'));
  vehicle();
  methods['usuario.findUnique'] = async () => ({ id: 1, activo: true });
  methods['tipoMantenimiento.findUnique'] = async () => ({ id: 1, activo: true });
  methods['estadoOrden.findUnique'] = async () => ({ id: 1, nombre: 'Solicitada' });
  methods['ordenMantenimiento.create'] = async ({ data }) => {
    assert.equal(data.estadoOrdenId, 1);
    return { id: 9, ...data, fechaSolicitud: new Date(Date.now() - 2 * 86400000) };
  };
  const result = await request('/orden', 'POST', body);
  assert.equal(result.status, 201, JSON.stringify(result.body));
  assert.equal(result.body.data.diasTranscurridos, 2);
});
test('correos de técnicos y proveedores respetan el tamaño de la columna', () => {
  const correo = 'a'.repeat(60) + '@' + 'b'.repeat(60) + '.' + 'c'.repeat(40) + '.com';
  assert.equal(schemas.updateTecnicoSchema.safeParse({ correo }).success, false);
  assert.equal(schemas.updateProveedorSchema.safeParse({ correo }).success, false);
});

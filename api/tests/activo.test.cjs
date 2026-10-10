const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

// Las pruebas HTTP no requieren acceso a una base de datos.
process.env.DATABASE_URL = 'mysql://test:test@127.0.0.1:3306/flota_test';
const { app } = require('../dist/server');
const { prisma } = require('../dist/config/prisma');

let server;
let base;
const originalList = prisma.activo.findMany;
const originalDetail = prisma.activo.findUnique;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  prisma.activo.findMany = originalList;
  prisma.activo.findUnique = originalDetail;
  await new Promise(resolve => server.close(resolve));
  await prisma.$disconnect();
});

async function request(route, options) {
  const response = await fetch(base + route, options);
  return { status: response.status, body: await response.json() };
}

test('listar devuelve vehículos con sus relaciones', async () => {
  const vehicle = { id: 7, placa: 'ABC123', modelo: { marca: { nombre: 'Toyota' } }, categoria: { nombre: 'Liviano' }, estadoActivo: { nombre: 'Operativo' } };
  prisma.activo.findMany = async () => [vehicle];
  const result = await request('/activo');
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, { success: true, data: [vehicle] });
});

test('listar una base sin vehículos devuelve un arreglo vacío', async () => {
  prisma.activo.findMany = async () => [];
  assert.deepEqual(await request('/activo'), { status: 200, body: { success: true, data: [] } });
});

test('obtener consulta el ID correcto y devuelve el detalle', async () => {
  const vehicle = { id: 7, placa: 'ABC123', tipoCombustible: { nombre: 'Gasolina' } };
  prisma.activo.findUnique = async ({ where }) => {
    assert.equal(where.id, 7);
    return vehicle;
  };
  assert.deepEqual(await request('/activo/7'), { status: 200, body: { success: true, data: vehicle } });
});

test('IDs malformados o fuera del rango no consultan la base', async () => {
  prisma.activo.findUnique = async () => { assert.fail('No debe consultar un ID inválido'); };
  for (const id of ['abc', '1abc', '0', '-1', '1.5', '2147483648', '999999999999999999999']) {
    const result = await request('/activo/' + id);
    assert.equal(result.status, 400, id);
    assert.deepEqual(result.body, { success: false, message: 'ID inválido' });
  }
});

test('vehículo inexistente devuelve 404', async () => {
  prisma.activo.findUnique = async () => null;
  assert.deepEqual(await request('/activo/7'), { status: 404, body: { success: false, message: 'Vehículo no encontrado' } });
});

test('errores de consultas se convierten en 500 sin exponer detalles internos', async () => {
  const fail = async () => { throw new Error('Información privada de conexión'); };
  prisma.activo.findMany = fail;
  prisma.activo.findUnique = fail;
  for (const route of ['/activo', '/activo/7']) {
    const result = await request(route);
    assert.deepEqual(result, { status: 500, body: { success: false, message: 'Error interno del servidor' } });
  }
});

test('rutas desconocidas y JSON inválido devuelven errores en JSON', async () => {
  assert.deepEqual(await request('/desconocida'), { status: 404, body: { success: false, message: 'Ruta no encontrada' } });
  const result = await request('/activo', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' });
  assert.deepEqual(result, { status: 400, body: { success: false, message: 'JSON inválido' } });
});

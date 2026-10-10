const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

process.env.LOG_LEVEL = 'silent';
process.env.DATABASE_URL = 'mysql://test:test@127.0.0.1:3306/flota_test';
const { app } = require('../dist/server');
const { prisma } = require('../dist/config/prisma');

const catalogs = [
  { path: '/rol', model: 'rol', missing: 'Rol no encontrado' },
  { path: '/estadoActivo', model: 'estadoActivo', missing: 'Estado de vehículo no encontrado' },
  { path: '/estadoOrden', model: 'estadoOrden', missing: 'Estado de orden no encontrado' },
  { path: '/categoriaActivo', model: 'categoriaActivo', missing: 'Categoría de vehículo no encontrada' },
];
const originals = catalogs.map(({ model }) => ({ model, listar: prisma[model].findMany, obtener: prisma[model].findUnique }));
let server;
let base;
before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  for (const item of originals) {
    prisma[item.model].findMany = item.listar;
    prisma[item.model].findUnique = item.obtener;
  }
  await new Promise(resolve => server.close(resolve));
  await prisma.$disconnect();
});
async function request(route) {
  const response = await fetch(base + route);
  const body = await response.json();
  // Comprobar el nuevo contrato antes de comparar los datos de las consultas previas.
  assert.equal(body.statusCode, response.status);
  assert.equal(typeof body.message, 'string');
  if (!body.success) {
    assert.equal(typeof body.error, 'string');
    assert.equal(body.path, route);
    assert.ok(!Number.isNaN(Date.parse(body.timestamp)));
  }
  const content = body.success ? { success: true, data: body.data } : { success: false, message: body.message };
  return { status: response.status, body: content };
}

for (const catalog of catalogs) {
  test(catalog.path + ': listar registros y catálogo vacío', async () => {
    const records = [{ id: 3, nombre: 'Ejemplo', descripcion: null }];
    prisma[catalog.model].findMany = async () => records;
    assert.deepEqual(await request(catalog.path), { status: 200, body: { success: true, data: records } });
    prisma[catalog.model].findMany = async () => [];
    assert.deepEqual(await request(catalog.path), { status: 200, body: { success: true, data: [] } });
  });

  test(catalog.path + ': detalle usa el ID solicitado', async () => {
    const record = { id: 3, nombre: 'Ejemplo' };
    prisma[catalog.model].findUnique = async ({ where }) => {
      assert.equal(where.id, 3);
      return record;
    };
    assert.deepEqual(await request(catalog.path + '/3'), { status: 200, body: { success: true, data: record } });
  });

  test(catalog.path + ': IDs inválidos no consultan Prisma', async () => {
    prisma[catalog.model].findUnique = async () => { assert.fail('ID inválido consultado'); };
    for (const id of ['abc', '1abc', '0', '-1', '1.5', '2147483648']) {
      assert.deepEqual(await request(catalog.path + '/' + id), { status: 400, body: { success: false, message: 'ID inválido' } });
    }
  });

  test(catalog.path + ': registro inexistente devuelve 404', async () => {
    prisma[catalog.model].findUnique = async () => null;
    assert.deepEqual(await request(catalog.path + '/3'), { status: 404, body: { success: false, message: catalog.missing } });
  });

  test(catalog.path + ': errores de listado y detalle se manejan centralmente', async () => {
    const fail = async () => { throw new Error('Detalle interno de conexión'); };
    prisma[catalog.model].findMany = fail;
    prisma[catalog.model].findUnique = fail;
    for (const suffix of ['', '/3']) {
      assert.deepEqual(await request(catalog.path + suffix), { status: 500, body: { success: false, message: 'Error interno del servidor' } });
    }
  });
}

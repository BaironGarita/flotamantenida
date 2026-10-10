const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
process.env.LOG_LEVEL = 'silent';
process.env.DATABASE_URL = 'mysql://test:test@127.0.0.1:3306/flota_test';
const { app } = require('../dist/server');
const { prisma } = require('../dist/config/prisma');
const resources = [
  {
    "path": "/claseMantenimiento",
    "model": "claseMantenimiento",
    "missing": "Clase de mantenimiento no encontrada"
  },
  {
    "path": "/prioridad",
    "model": "prioridad",
    "missing": "Prioridad no encontrada"
  },
  {
    "path": "/nivelCriticidad",
    "model": "nivelCriticidad",
    "missing": "Nivel de criticidad no encontrado"
  },
  {
    "path": "/tipoCombustible",
    "model": "tipoCombustible",
    "missing": "Tipo de combustible no encontrado"
  },
  {
    "path": "/unidadMedida",
    "model": "unidadMedida",
    "missing": "Unidad de medida no encontrada"
  },
  {
    "path": "/nivelCertificacion",
    "model": "nivelCertificacion",
    "missing": "Nivel de certificación no encontrado"
  },
  {
    "path": "/marca",
    "model": "marca",
    "missing": "Marca no encontrada"
  },
  {
    "path": "/modelo",
    "model": "modelo",
    "missing": "Modelo no encontrado"
  },
  {
    "path": "/especialidad",
    "model": "especialidad",
    "missing": "Especialidad no encontrada"
  },
  {
    "path": "/tipoMantenimiento",
    "model": "tipoMantenimiento",
    "missing": "Tipo de mantenimiento no encontrado"
  },
  {
    "path": "/tecnico",
    "model": "tecnico",
    "missing": "Técnico no encontrado"
  },
  {
    "path": "/repuesto",
    "model": "repuesto",
    "missing": "Repuesto no encontrado"
  },
  {
    "path": "/proveedor",
    "model": "proveedor",
    "missing": "Proveedor no encontrado"
  },
  {
    "path": "/usuario",
    "model": "usuario",
    "missing": "Usuario no encontrado"
  },
  {
    "path": "/orden",
    "model": "ordenMantenimiento",
    "missing": "Orden de mantenimiento no encontrada"
  },
  {
    "path": "/historialEstadoActivo",
    "model": "historialEstadoActivo",
    "missing": "Historial de vehículo no encontrado"
  },
  {
    "path": "/historialEstadoOrden",
    "model": "historialEstadoOrden",
    "missing": "Historial de orden no encontrado"
  }
];
const originals = resources.map(({ model }) => ({ model, list: prisma[model].findMany, detail: prisma[model].findUnique }));
let server;
let base;
before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = 'http://127.0.0.1:' + server.address().port;
});
after(async () => {
  for (const item of originals) {
    prisma[item.model].findMany = item.list;
    prisma[item.model].findUnique = item.detail;
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
for (const resource of resources) {
  test(resource.path + ': listado y listado vacío', async () => {
    const records = [{ id: 7, nombre: 'Dato de prueba' }];
    prisma[resource.model].findMany = async () => records;
    assert.deepEqual(await request(resource.path), { status: 200, body: { success: true, data: records } });
    prisma[resource.model].findMany = async () => [];
    assert.deepEqual(await request(resource.path), { status: 200, body: { success: true, data: [] } });
  });
  test(resource.path + ': detalle del ID solicitado', async () => {
    const record = { id: 7, nombre: 'Dato de prueba' };
    prisma[resource.model].findUnique = async ({ where }) => {
      assert.equal(where.id, 7);
      return record;
    };
    assert.deepEqual(await request(resource.path + '/7'), { status: 200, body: { success: true, data: record } });
  });
  test(resource.path + ': rechazo de IDs inválidos antes de consultar', async () => {
    prisma[resource.model].findUnique = async () => { assert.fail('ID inválido consultado'); };
    for (const id of ['abc', '1abc', '0', '-1', '1.5', '2147483648']) {
      assert.deepEqual(await request(resource.path + '/' + id), { status: 400, body: { success: false, message: 'ID inválido' } });
    }
  });
  test(resource.path + ': registro inexistente', async () => {
    prisma[resource.model].findUnique = async () => null;
    assert.deepEqual(await request(resource.path + '/7'), { status: 404, body: { success: false, message: resource.missing } });
  });
  test(resource.path + ': errores de consulta se manejan sin detalles internos', async () => {
    const fail = async () => { throw new Error('Detalle privado'); };
    prisma[resource.model].findMany = fail;
    prisma[resource.model].findUnique = fail;
    for (const suffix of ['', '/7']) {
      assert.deepEqual(await request(resource.path + suffix), { status: 500, body: { success: false, message: 'Error interno del servidor' } });
    }
  });
}
test('órdenes por solicitante aplican el filtro sin aceptar roles de la URL', async () => {
  const records = [{ id: 1, usuarioSolicitanteId: 6 }];
  prisma.ordenMantenimiento.findMany = async ({ where }) => {
    assert.deepEqual(where, { usuarioSolicitanteId: 6 });
    return records;
  };
  assert.deepEqual(await request('/orden/usuario?usuarioId=6&role=ADMIN'), { status: 200, body: { success: true, data: records } });
});
test('órdenes por solicitante rechazan filtros ausentes o inválidos', async () => {
  prisma.ordenMantenimiento.findMany = async () => { assert.fail('Filtro inválido consultado'); };
  for (const query of ['', '?usuarioId=abc', '?usuarioId=0', '?usuarioId=1abc', '?usuarioId=2147483648', '?usuarioId=1&usuarioId=2']) {
    assert.deepEqual(await request('/orden/usuario' + query), { status: 400, body: { success: false, message: 'ID de usuario inválido' } });
  }
});
test('órdenes por solicitante sin resultados devuelven un arreglo vacío', async () => {
  prisma.ordenMantenimiento.findMany = async () => [];
  assert.deepEqual(await request('/orden/usuario?usuarioId=6'), { status: 200, body: { success: true, data: [] } });
});
test('órdenes por solicitante delegan los errores al middleware', async () => {
  prisma.ordenMantenimiento.findMany = async () => { throw new Error('Detalle privado'); };
  assert.deepEqual(await request('/orden/usuario?usuarioId=6'), { status: 500, body: { success: false, message: 'Error interno del servidor' } });
});

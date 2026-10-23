const { test, before, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');
process.env.LOG_LEVEL = 'silent';
process.env.DATABASE_URL = 'mysql://test:test@127.0.0.1:3306/flota_test';
const { app } = require('../dist/server');
const { prisma } = require('../dist/config/prisma');
const { Prisma } = require('../dist/generated/prisma/client');
const { AppError } = require('../dist/utils/app-error');
const { mapPrismaError } = require('../dist/utils/prisma-error.mapper');
let server, base;
const originals = [];
function stub(model, method, fn) {
  originals.push([prisma[model], method, prisma[model][method]]);
  prisma[model][method] = fn;
}
before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  base = 'http://127.0.0.1:' + server.address().port;
});
beforeEach(() => {
  for (const [object, key, fn] of originals.reverse()) object[key] = fn;
  originals.length = 0;
  for (const name of ['modelo','tipoCombustible','categoriaActivo','nivelCriticidad','estadoActivo','prioridad'])
    stub(name,'findUnique',async () => ({ id: 1 }));
  stub('estadoOrden','findUnique',async () => ({ id: 1, nombre: 'Solicitada' }));
  stub('usuario','findUnique',async () => ({ id: 1, activo: true }));
  stub('tipoMantenimiento','findUnique',async () => ({ id: 1, activo: true }));
  stub('activo','findUnique',async () => ({ id: 55, estadoActivoId: 1, kilometrajeActual: 1000, kilometrajeRegistro: 900 }));
  stub('ordenMantenimiento','findUnique',async () => ({ id: 66, estadoOrdenId: 1 }));
});
after(async () => {
  for (const [object,key,fn] of originals.reverse()) object[key] = fn;
  await new Promise(resolve => server.close(resolve));
  await prisma.$disconnect();
});
async function request(route, method='GET', body) {
  const response = await fetch(base + route, { method,
    ...(body === undefined ? {} : { headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }) });
  const json = await response.json();
  assert.equal(json.statusCode, response.status);
  if (!json.success) { assert.equal(json.path, route); assert.ok(!Number.isNaN(Date.parse(json.timestamp))); assert.equal(typeof json.error, 'string'); }
  return { status: response.status, body: json };
}
const vehicle = { codigo: 'CPE-9999', nombre: 'Vehículo de prueba', placa: 'TEST999', modeloId: 1, anio: 2024,
  tipoCombustibleId: 1, categoriaId: 1, nivelCriticidadId: 1, fechaAdquisicion: '2024-06-01',
  valorReferencia: 10000.50, kilometrajeRegistro: 900, kilometrajeActual: 1000 };
const order = { codigo: 'OM-2026-9999', activoId: 55, tipoMantenimientoId: 1, usuarioSolicitanteId: 1,
  motivo: 'Revisar vibración del motor', kilometrajeAlSolicitar: 1000 };
test('POST vehículo convierte fecha, fija estado y devuelve 201 con detalle', async () => {
  stub('activo','create',async ({data}) => { assert.ok(data.fechaAdquisicion instanceof Date); assert.equal(data.estadoActivoId,1); return {id:55}; });
  const result = await request('/activo','POST',vehicle);
  assert.equal(result.status,201); assert.equal(result.body.data.id,55);
});
test('DTO rechaza precio de texto, kilometraje incoherente y fecha inválida sin escribir', async () => {
  stub('activo','create',async () => assert.fail('No debe guardar datos inválidos'));
  for(const changes of [{valorReferencia:'10000'},{kilometrajeActual:1},{fechaAdquisicion:'2026-02-30'},{nombre:'AB'},{codigo:'sin-patron'}]) {
    const result=await request('/activo','POST',{...vehicle,...changes});
    assert.equal(result.status,400); assert.ok(result.body.validationErrors.length);
  }
});
test('referencia de categoría inexistente devuelve 400', async () => {
  stub('categoriaActivo','findUnique',async()=>null);
  assert.equal((await request('/activo','POST',vehicle)).status,400);
});
test('restricción única de Prisma devuelve 409 sin filtrar datos internos', async () => {
  stub('activo','create',async()=>{throw new Prisma.PrismaClientKnownRequestError('detalle secreto',{code:'P2002',clientVersion:'7',meta:{target:['codigo']}});});
  const result=await request('/activo','POST',vehicle);
  assert.equal(result.status,409); assert.equal(result.body.error,'ConflictError');
  assert.ok(!JSON.stringify(result.body).includes('detalle secreto'));
});
test('PUT parcial conserva campos omitidos y convierte fechas solo si llegan', async () => {
  stub('activo','update',async({where,data})=>{assert.equal(where.id,55);assert.deepEqual(data,{nombre:'Nombre actualizado'});return {id:55};});
  assert.equal((await request('/activo/55','PUT',{nombre:'Nombre actualizado'})).status,200);
});
test('PUT valida kilometraje usando el valor anterior', async () => {
  assert.equal((await request('/activo/55','PUT',{kilometrajeActual:800})).status,400);
});
test('PUT vehículo inexistente responde 404', async () => {
  stub('activo','findUnique',async()=>null);
  assert.equal((await request('/activo/55','PUT',{nombre:'Nombre actualizado'})).status,404);
});
test('cambio administrativo con orden abierta responde 409', async () => {
  stub('ordenMantenimiento','count',async({where})=>{assert.deepEqual(where.estadoOrdenId.notIn,[4,7,8]);return 1;});
  assert.equal((await request('/activo/55','PUT',{estadoActivoId:3})).status,409);
});
test('paginación envía skip/take y responde con metadatos coherentes', async () => {
  stub('activo','findMany',async({skip,take})=>{assert.equal(skip,5);assert.equal(take,5);return [{id:6}];});
  stub('activo','count',async()=>12);
  originals.push([prisma,'$transaction',prisma.$transaction]); prisma.$transaction=async operations=>Promise.all(operations);
  const result=await request('/activo?page=2&limit=5');
  assert.deepEqual(result.body.meta,{total:12,page:2,limit:5,totalPages:3,hasNextPage:true,hasPrevPage:true});
});
test('paginación inválida usa valores por defecto y limita a 100', async () => {
  stub('activo','count',async()=>0);
  originals.push([prisma,'$transaction',prisma.$transaction]); prisma.$transaction=async operations=>Promise.all(operations);
  for(const [query,take] of [['?page=-1&limit=abc',10],['?limit=999',100]]) {
    stub('activo','findMany',async(args)=>{assert.equal(args.skip,0);assert.equal(args.take,take);return [];});
    assert.equal((await request('/activo'+query)).status,200);
  }
});
test('crear solicitud fija Solicitada y no acepta costos o transiciones', async () => {
  stub('ordenMantenimiento','create',async({data})=>{assert.equal(data.estadoOrdenId,1);assert.equal(data.costoTotal,undefined);return {id:66,...data};});
  assert.equal((await request('/orden','POST',order)).status,201);
  for(const extra of [{estadoOrdenId:2},{costoTotal:99},{repuestos:[]}]) {
    const result=await request('/orden','POST',{...order,...extra}); assert.equal(result.status,400); assert.ok(result.body.validationErrors.length);
  }
});
test('orden valida vehículo, solicitante y tipo de mantenimiento', async () => {
  stub('activo','findUnique',async()=>null);
  assert.equal((await request('/orden','POST',order)).status,404);
  stub('activo','findUnique',async()=>({id:55,estadoActivoId:1}));
  stub('usuario','findUnique',async()=>({id:1,activo:false}));
  assert.equal((await request('/orden','POST',order)).status,400);
  stub('usuario','findUnique',async()=>({id:1,activo:true}));
  stub('tipoMantenimiento','findUnique',async()=>null);
  assert.equal((await request('/orden','POST',order)).status,400);
});
test('actualizar solicitud omite campos no enviados y acepta fecha null', async () => {
  stub('ordenMantenimiento','update',async({data})=>{assert.deepEqual(data,{motivo:'Motivo modificado de prueba',fechaProgramada:null});return {id:66,...data};});
  assert.equal((await request('/orden/66','PUT',{motivo:'Motivo modificado de prueba',fechaProgramada:null})).status,200);
});
test('edición de orden fuera de Solicitada responde 409 y no escribe', async () => {
  stub('ordenMantenimiento','findUnique',async()=>({id:66,estadoOrdenId:5}));
  stub('ordenMantenimiento','update',async()=>assert.fail('No debe editar una orden en ejecución'));
  assert.equal((await request('/orden/66','PUT',{motivo:'Motivo modificado de prueba'})).status,409);
});
test('PUT vacío y recurso inexistente tienen 400 y 404 respectivamente', async () => {
  assert.equal((await request('/orden/66','PUT',{})).status,400);
  stub('ordenMantenimiento','findUnique',async()=>null);
  assert.equal((await request('/orden/66','PUT',{motivo:'Motivo modificado de prueba'})).status,404);
});
test('mapper traduce errores conocidos y distingue borrar de insertar', () => {
  for(const [code,method,status] of [['P2002','POST',409],['P2025','PUT',404],['P2003','POST',400],['P2003','DELETE',409],['P2014','PUT',409]]) {
    const error=new Prisma.PrismaClientKnownRequestError('interno',{code,clientVersion:'7'});
    assert.equal(mapPrismaError(error,method).statusCode,status);
  }
  assert.equal(mapPrismaError(new Error('inesperado'),'GET'),null);
  assert.equal(AppError.internalServer().isOperational,false);
});

const { test } = require('node:test');
const assert = require('node:assert/strict');


const dto = require('../dist/dtos/response.dto');
const { Prisma } = require('../dist/generated/prisma/client');

test('DTOs de módulos excluyen campos nuevos o privados del ORM', () => {
  for (const mapper of [dto.activoResponseDto, dto.categoriaResponseDto, dto.tecnicoResponseDto,
    dto.especialidadResponseDto, dto.repuestoResponseDto, dto.proveedorResponseDto, dto.ordenResponseDto]) {
    const source = { id: 1, contrasenaHash: 'privado', datoInternoNuevo: 'no exponer', _count: { secreto: 3 } };
    assert.deepEqual(mapper(source), { id: 1 });
    assert.notEqual(mapper(source), source);
    assert.deepEqual(mapper([source]), [{ id: 1 }]);
  }
});
test('DTO de orden conserva identidad pública y elimina hashes en relaciones anidadas', () => {
  const output = dto.ordenResponseDto({ id: 1, usuarioSolicitante: {
    id: 2, nombreCompleto: 'Persona de prueba', contrasenaHash: 'privado',
    rol: { id: 3, nombre: 'Solicitante', datoInterno: 'privado' },
  }, activo: { id: 4, codigo: 'CPE-0004', categoria: { id: 1, nombre: 'Carga', datoInterno: 'privado' } } });
  const serialized = JSON.stringify(output);
  assert.ok(!serialized.includes('privado'));
  assert.equal(output.usuarioSolicitante.nombreCompleto, 'Persona de prueba');
  assert.equal(output.activo.categoria.nombre, 'Carga');
});
test('DTOs convierten fechas e importes sin perder valores cero o nulos', () => {
  const output = dto.activoResponseDto({ id: 1, fechaAdquisicion: new Date('2024-06-01T00:00:00Z'),
    valorReferencia: new Prisma.Decimal('1234.50'), kilometrajeActual: 0, imagenUrl: null,
    antiguedadAnios: 2, cantidadOrdenes: 0 });
  assert.equal(output.fechaAdquisicion, '2024-06-01T00:00:00.000Z');
  assert.equal(output.valorReferencia, '1234.5');
  assert.equal(output.kilometrajeActual, 0);
  assert.equal(output.imagenUrl, null);
  assert.equal(output.cantidadOrdenes, 0);
});
test('DTOs de relaciones N:N conservan certificación, antigüedad y condiciones', () => {
  const specialty = dto.tecnicoEspecialidadResponseDto({ tecnicoId: 1, especialidadId: 2,
    fechaCertificacion: new Date('2020-01-01'), antiguedadAnios: 6,
    especialidad: { id: 2, nombre: 'Mecánica' }, nivelCertificacion: { id: 3, nombre: 'Avanzado' },
    datoInterno: 'privado' });
  assert.equal(specialty.antiguedadAnios, 6);
  assert.equal(specialty.especialidad.nombre, 'Mecánica');
  assert.equal(specialty.nivelCertificacion.nombre, 'Avanzado');
  assert.ok(!Object.hasOwn(specialty, 'datoInterno'));
  const supply = dto.repuestoProveedorResponseDto({ repuestoId: 1, proveedorId: 2,
    precio: new Prisma.Decimal('0'), tiempoEntregaDias: 0, proveedor: { id: 2, nombre: 'Proveedor' } });
  assert.equal(supply.precio, '0');
  assert.equal(supply.tiempoEntregaDias, 0);
  assert.equal(supply.proveedor.nombre, 'Proveedor');
});

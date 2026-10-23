const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('colección usa una sola URL válida y no contiene expectativas HTTP indefinidas', () => {
  const collection = JSON.parse(fs.readFileSync(path.join(__dirname, '../postman/Flota Mantenida.postman_collection.json'), 'utf8'));
  for (const folder of collection.item) for (const item of folder.item || []) {
    assert.equal(typeof item.request.url, 'string', item.name);
    const literal = item.request.url.replace(/\{\{\w+\}\}/g, 'variable');
    assert.ok(!/[{}]/.test(literal), item.name + ': llaves sobrantes');
    assert.ok(!JSON.stringify(item.event || []).includes('status(undefined)'), item.name);
  }
});

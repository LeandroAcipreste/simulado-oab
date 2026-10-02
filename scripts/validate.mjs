import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);
const bank = JSON.parse(fs.readFileSync(new URL('bank.json', root), 'utf8'));
assert.equal(bank.exams.length, 18, 'O banco deve conter 18 provas');
assert.equal(bank.meta.questionCount, 72);
assert.equal(bank.meta.pieceCount, 18);
const ids = new Set(), contents = new Set();
for (const exam of bank.exams) {
  assert.equal(exam.area, 'Trabalho');
  assert.equal(exam.items.length, 5, `${exam.id}: deve ter cinco itens`);
  assert.deepEqual(exam.items.map(i => i.number), [0, 1, 2, 3, 4]);
  assert.deepEqual(exam.items.map(i => i.max), [5, 1.25, 1.25, 1.25, 1.25]);
  assert.equal(exam.items.reduce((s, i) => s + i.max, 0), 10);
  assert.ok(exam.sourceUrl.startsWith('https://'));
  for (const item of exam.items) {
    assert.ok(!ids.has(item.id), `ID duplicado: ${item.id}`);
    ids.add(item.id);
    const normalized = item.statement.replace(/\s/g, '').toLowerCase();
    assert.ok(!contents.has(normalized), `Enunciado duplicado: ${item.id}`);
    contents.add(normalized);
    assert.ok(item.statement.length > 150, `Enunciado curto: ${item.id}`);
    assert.ok(item.rubric.length > 100, `Espelho curto: ${item.id}`);
    assert.ok(!item.statement.includes('RASCUNHO'), `Rascunho no enunciado: ${item.id}`);
  }
}
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(new URL('dist/data.js', root), 'utf8'), context);
assert.equal(JSON.stringify(context.window.OAB_DATA), JSON.stringify(bank));
new vm.Script(fs.readFileSync(new URL('dist/app.js', root), 'utf8'));
for (const asset of ['index.html', 'styles.css', 'app.js', 'data.js']) {
  assert.ok(fs.statSync(new URL(`dist/${asset}`, root)).size > 0);
}
console.log('OK: 72 questões únicas + 18 peças; 18 provas completas; espelhos presentes; JSON sincronizado; JavaScript válido.');

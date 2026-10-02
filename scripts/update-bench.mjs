// Atualiza somente as edições do OAB-Bench já incluídas no banco.
// GitHub Raw é um endpoint público de arquivos; não exige chave de API.
import fs from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const base = 'https://raw.githubusercontent.com/maritaca-ai/oab-bench/main/data/oab_bench/';
async function jsonl(path) {
  const res = await fetch(base + path);
  if (!res.ok) throw new Error(`Falha HTTP ${res.status} ao buscar ${path}`);
  return (await res.text()).trim().split(/\r?\n/).map(JSON.parse);
}
const [questions, guidelines] = await Promise.all([
  jsonl('question.jsonl'), jsonl('reference_answer/guidelines.jsonl'),
]);
const bank = JSON.parse(await fs.readFile(new URL('bank.json', root), 'utf8'));
const refs = new Map(guidelines.map(g => [g.question_id, g]));
let updated = 0;
for (const exam of bank.exams.filter(e => e.source.startsWith('OAB-Bench'))) {
  const rows = questions.filter(q => q.category === exam.id);
  if (rows.length !== 5) throw new Error(`Prova incompleta: ${exam.id}`);
  const items = rows.map(q => {
    const piece = q.question_id.includes('peca_profissional');
    const number = piece ? 0 : Number(q.question_id.split('_').at(-1));
    const guide = refs.get(q.question_id)?.choices?.[0]?.turns;
    if (!guide?.length || !q.statement) throw new Error(`Dados incompletos: ${q.question_id}`);
    return {
      id: q.question_id, number, title: piece ? 'Peça profissional' : `Questão ${number}`,
      max: piece ? 5 : 1.25,
      statement: q.statement + (piece ? '' : '\n\n' + q.turns.map((t, i) =>
        `${String.fromCharCode(65 + i)}) ${t} (Valor: ${q.values[i].toFixed(2)})`).join('\n\n')),
      rubric: guide.join('\n\n'),
    };
  }).sort((a, b) => a.number - b.number);
  if (items.map(i => i.number).join(',') !== '0,1,2,3,4') throw new Error('Numeração inválida');
  exam.items = items;
  updated++;
}
bank.meta.benchUpdatedAt = new Date().toISOString();
await fs.writeFile(new URL('bank.json', root), JSON.stringify(bank, null, 2));
await fs.writeFile(new URL('dist/data.js', root), `window.OAB_DATA = ${JSON.stringify(bank)};`);
console.log(`${updated} provas atualizadas pelo endpoint público do GitHub. Execute node scripts/validate.mjs.`);

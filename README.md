# Prática — Segunda fase trabalhista da OAB

Projeto em **HTML, CSS e JavaScript puros**, sem framework, banco de dados ou chave de API. Abra `dist/index.html` no navegador ou sirva a pasta `dist` com um servidor HTTP estático.

## Publicar na Vercel

1. Na Vercel, escolha **Add New → Project** e importe `LeandroAcipreste/simulado-oab`.
2. Mantenha **Root Directory** na raiz do repositório e o preset **Other**.
3. Clique em **Deploy**. O `vercel.json` já define o comando `npm run build` e a pasta pública `dist`.

Não é necessário configurar variáveis de ambiente nem instalar dependências. O build valida o banco e a sintaxe JavaScript; o site é estático. Depois de conectar o repositório, a Vercel pode publicar automaticamente os novos commits na branch de produção.

Configuração oficial: https://vercel.com/docs/project-configuration/vercel-json

## Uso

1. Selecione a edição do exame de Direito do Trabalho.
2. Responda à peça profissional e às quatro questões discursivas em até cinco horas.
3. Conclua as respostas e compare os textos com os espelhos.
4. Atribua a pontuação de cada resposta conforme a distribuição indicada no espelho.
5. Veja o total de 0 a 10, com referência de 6 pontos, e exporte o resultado.

O sistema faz **autoavaliação com soma automática**, não correção jurídica automática. Uma comparação de palavras não seria suficiente para avaliar estas respostas. Para avaliação por professor ou IA, seria necessário implementar um serviço de correção separado; nunca colocar chaves de API no JavaScript público.

## Arquivos

- `dist/index.html`: estrutura semântica e entrada do aplicativo.
- `dist/styles.css`: interface responsiva.
- `dist/app.js`: filtros, paginação, cronômetro, rascunhos, correção, resultado e histórico.
- `dist/data.js`: banco incorporado, permitindo abrir o HTML diretamente, sem `fetch` bloqueado por `file://`.
- `bank.json`: o mesmo banco em JSON para integrações.
- `scripts/`: coleta e conversão reproduzíveis dos dados públicos.
- `THIRD_PARTY_NOTICES.md`: fontes, proveniência e limitações.

## Dados abertos e fontes

Foi encontrado o [OAB-Bench da Maritaca AI](https://github.com/maritaca-ai/oab-bench), um dataset aberto de segunda fase. Não é uma API de correção gratuita. Os arquivos JSONL podem ser acessados sem autenticação pelo GitHub Raw:

- `https://raw.githubusercontent.com/maritaca-ai/oab-bench/main/data/oab_bench/question.jsonl`
- `https://raw.githubusercontent.com/maritaca-ai/oab-bench/main/data/oab_bench/reference_answer/guidelines.jsonl`

O conjunto possui 210 itens das edições 39–44: 168 questões e 42 peças. O banco foi complementado com cadernos e padrões de resposta do [arquivo oficial da FGV](https://oab.fgv.br/). Cada prova contém sua fonte, e os PDFs oficiais complementares têm links específicos de caderno e espelho.

As questões são históricas. A legislação e a jurisprudência podem ter sido alteradas desde sua aplicação. O texto extraído de PDF pode conservar pequenas quebras, espaços ou erros tipográficos do documento; o original vinculado prevalece. A revisão técnica individual do conteúdo jurídico não foi realizada.

## Persistência e privacidade

As respostas ficam no `localStorage` do navegador, na chave `pratica-oab-v1`. Não são enviadas a servidores e não há sincronização entre dispositivos. Limpar dados do navegador apaga rascunhos e histórico. Use a exportação para guardar cópias. As fontes tipográficas externas são opcionais; o layout usa fontes do sistema quando está offline.

O prazo é salvo como horário absoluto; fechar a página não pausa o cronômetro. O horário depende do relógio do dispositivo. A versão é um ambiente de estudo, não uma aplicação fiscalizada de exame.

## Verificação

Execute `node scripts/validate.mjs` na raiz do projeto para validar quantidade, integridade, unicidade e composição das provas. A interface foi testada no navegador para filtros, redação, conclusão, limite de notas e resultado de 6,00/10.

Não há dependências JavaScript de execução. O atributo opcional `document.modelContext` expõe a consulta somente de leitura `list_oab_exams` quando o navegador suporta WebMCP.

## Recorte trabalhista

O projeto é exclusivo de Direito do Trabalho. O banco cobre as edições 29–46, com 72 questões discursivas e 18 peças. Não foram encontradas 500 questões oficiais únicas de Trabalho dos últimos anos; a quantidade não foi inflada com repetições nem enunciados inventados.

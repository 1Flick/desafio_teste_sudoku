/**
 * ESPECIFICAÇÃO EXECUTÁVEL — SUDOKU BINÁRIO (TAKUZU)
 * Enunciado: JavaScript, grade 6 x 6 (não é Sudoku clássico 1..9).
 * Origem: github.com/JoaoChoma/teste_software_2026/blob/main/desafios.md
 * Colaboradores: Pedro Lucas Gomes Braido (24190443-2);
 * Leonardo Fratoni Borges da Silva (24047610-2).
 *
 * Node.js >= 24. Implemente sudoku_binario.js ao lado deste arquivo, ESM.
 * Execute: node --test sudoku_binario.test.js
 * Alternativa: variável MODULO_SUDOKU_BINARIO = caminho da implementação.
 * Nenhum arquivo auxiliar de teste é necessário.
 *
 * API: validar(matriz, completo=false):boolean; resolver(matriz):matriz|null;
 * class SudokuBinario { constructor(matriz); jogar(linha,coluna,0|1|null); }
 * Estado público: tabuleiro (matriz copiada), fixas (matriz booleana).
 * jogar retorna 'jogando' ou 'venceu'. Índices de 0 a 5. null APAGA jogada.
 *
 * REGRAS ESCOLHIDAS PARA COMPLETAR O ENUNCIADO:
 * - Matriz 6x6; cada casa é EXATAMENTE 0, 1 ou null (não '', false, -1 ou '0').
 * - Cada linha E coluna completa contém três zeros e três uns.
 * - Nunca há três valores iguais CONSECUTIVOS na horizontal/vertical.
 * - Linhas completas são distintas entre si; colunas completas também.
 *   Linhas/colunas incompletas repetidas são permitidas. Não há regra diagonal
 *   nem subquadrantes, e uma linha pode coincidir com uma coluna.
 * - validar(parcial) aceita apenas ausência de violações locais; NÃO promete
 *   que toda posição parcial válida tenha solução global.
 * - validar(matriz,true) exige, adicionalmente, nenhuma casa vazia.
 * - Estrutura/valores inválidos: lançar Error. Estrutura correta mas regras
 *   violadas: validar retorna false; resolver retorna null.
 * - resolver devolve QUALQUER solução válida que preserve pistas, sem alterar
 *   entrada; não se exige solução única nem um algoritmo de busca específico.
 * - Construtor rejeita pistas inconsistentes. Toda pista original é imutável,
 *   mesmo para escrever o mesmo valor. Casas sem pista podem ser editadas/apagadas.
 * - Jogada inválida lança Error e desfaz completamente a tentativa.
 * - Grade correta retorna 'venceu'; não há trava terminal permanente, pois é
 *   permitido apagar uma jogada para editar a grade de novo.
 * - Aparência, geração aleatória de puzzles e dicas de interface não são exigidas.
 *
 * Os auxiliares abaixo calculam propriedades dos dados de teste, não implementam
 * um jogo ou um solucionador alternativo.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const { validar, resolver, SudokuBinario } = await import(process.env.MODULO_SUDOKU_BINARIO
  ? pathToFileURL(resolve(process.env.MODULO_SUDOKU_BINARIO)).href
  : new URL('./sudoku_binario.js',import.meta.url).href);
const vazio=()=>Array.from({length:6},()=>Array(6).fill(null));
const copia=t=>t.map(l=>[...l]);
const transpor=t=>t[0].map((_,c)=>t.map(l=>l[c]));
// Solução conhecida independente de resolver(). Não se compara com uma única saída.
const SOLUCAO=[ [0,0,1,0,1,1], [0,0,1,1,0,1], [1,1,0,0,1,0], [0,1,0,0,1,1], [1,0,1,1,0,0], [1,1,0,1,0,0] ];
function linhaLegal(l) {
  return l.filter(v=>v===0).length<=3&&l.filter(v=>v===1).length<=3
    && ![0,1,2,3].some(i=>l[i]!==null&&l[i]===l[i+1]&&l[i]===l[i+2]);
}
function conferirSolucao(t,pistas) {
  assert.ok(Array.isArray(t));assert.equal(t.length,6);assert.ok(t.every(l=>Array.isArray(l)&&l.length===6));
  for(const linha of [...t,...transpor(t)]) {
    assert.equal(linha.filter(v=>v===0).length,3);assert.equal(linha.filter(v=>v===1).length,3);
    assert.equal(linhaLegal(linha),true);
  }
  assert.equal(new Set(t.map(l=>l.join(''))).size,6);assert.equal(new Set(transpor(t).map(l=>l.join(''))).size,6);
  pistas.forEach((l,r)=>l.forEach((v,c)=>{if(v!==null)assert.equal(t[r][c],v,`pista ${r},${c}`);}));
}
function rejeita(j,acao) {const antes=structuredClone({tabuleiro:j.tabuleiro,fixas:j.fixas});assert.throws(acao,Error);assert.deepEqual({tabuleiro:j.tabuleiro,fixas:j.fixas},antes);}

test('API exigida está presente',()=>{assert.equal(typeof validar,'function');assert.equal(typeof resolver,'function');assert.equal(typeof SudokuBinario,'function');});
test('grade vazia é parcial válida, mas não é vitória',()=>{assert.equal(validar(vazio()),true);assert.equal(validar(vazio(),true),false);});
test('solução conhecida é aceita e não sofre mutação pela validação',()=>{const t=copia(SOLUCAO);assert.equal(validar(t,true),true);assert.deepEqual(t,SOLUCAO);});
for(const t of [null,[],[[0]],Array.from({length:5},()=>Array(6).fill(null)),Array.from({length:6},()=>Array(5).fill(null)),Array(6).fill('000111')]) {
  test(`estrutura inválida é rejeitada: ${JSON.stringify(t)}`,()=>{assert.throws(()=>validar(t),Error);assert.throws(()=>resolver(t),Error);assert.throws(()=>new SudokuBinario(t),Error);});
}
for(const valor of [-1,2,'0','1','',true,false,undefined,NaN,Infinity,{},[]]) test(`casa ${String(valor)} não é 0, 1 ou null`,()=>{
  const t=vazio();t[2][3]=valor;assert.throws(()=>validar(t),Error);assert.throws(()=>resolver(t),Error);assert.throws(()=>new SudokuBinario(t),Error);
});
test('todas as 729 linhas parciais possíveis têm a classificação correta, também em colunas',()=>{
  for(let n=0;n<729;n++) {
    let k=n;const linha=Array.from({length:6},()=>{const v=[null,0,1][k%3];k=Math.floor(k/3);return v;});
    const t=vazio();t[2]=linha;const esperado=linhaLegal(linha);
    assert.equal(validar(t),esperado,`horizontal: ${JSON.stringify(linha)}`);
    assert.equal(validar(transpor(t)),esperado,`vertical: ${JSON.stringify(linha)}`);
  }
});
for(const valor of [0,1]) for(const inicio of [0,1,2,3]) for(const orientacao of ['linha','coluna']) test(`trinca ${valor} na ${orientacao}, começando em ${inicio}, é proibida`,()=>{
  const t=vazio();for(let i=0;i<3;i++) if(orientacao==='linha')t[1][inicio+i]=valor;else t[inicio+i][1]=valor;
  assert.equal(validar(t),false);
});

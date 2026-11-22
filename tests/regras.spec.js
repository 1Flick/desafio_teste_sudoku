// Testes das regras do Sudoku binário (B2, B3, B4).
// Modo somente testes: todos falham de propósito enquanto o jogo não existe.
import { abrirJogo, VAZIO, celula, todasAsCelulas } from './helpers.js';
import { definir } from "./cenarios/regras.js";
import { conferir } from "./support/verificacoes.js";
describe("Sudoku bin\xE1rio \u2014 regras", () => {
  test.each(['0', '1'])('TC-SB-08 trinca horizontal de %s marca as três células', async valor => {
    const user = await abrirJogo({
      puzzle: VAZIO
    });
    for (let c = 0; c < 3; c++) await definir(user, 0, c, valor);
    for (let c = 0; c < 3; c++) conferir.atributo(celula(0, c), 'data-erro', 'true');
    conferir.nao.atributo(celula(0, 3), 'data-erro', 'true');
  });
  test.each(['0', '1'])('TC-SB-09 trinca vertical de %s marca as três células', async valor => {
    const user = await abrirJogo({
      puzzle: VAZIO
    });
    for (let l = 2; l <= 4; l++) await definir(user, l, 4, valor);
    for (let l = 2; l <= 4; l++) conferir.atributo(celula(l, 4), 'data-erro', 'true');
    for (const l of [0, 1, 5]) conferir.nao.atributo(celula(l, 4), 'data-erro', 'true'); // só a trinca
  });
  test.each(['0', '1'])('TC-SB-10 mais de três %s na linha marca os quatro valores', async valor => {
    const user = await abrirJogo({
      puzzle: VAZIO
    });
    const oposto = valor === '0' ? '1' : '0';
    await definir(user, 1, 2, oposto); // o oposto entra primeiro: nunca existe trinca, nem por um instante
    for (const c of [0, 1, 3, 4]) await definir(user, 1, c, valor);
    for (const c of [0, 1, 3, 4]) conferir.atributo(celula(1, c), 'data-erro', 'true');
    conferir.nao.atributo(celula(1, 2), 'data-erro', 'true'); // o valor em minoria não é erro
  });
  test.each(['0', '1'])('TC-SB-11 mais de três %s na coluna marca os quatro valores', async valor => {
    const user = await abrirJogo({
      puzzle: VAZIO
    });
    const oposto = valor === '0' ? '1' : '0';
    await definir(user, 2, 2, oposto); // o oposto entra primeiro: nunca existe trinca, nem por um instante
    for (const l of [0, 1, 3, 4]) await definir(user, l, 2, valor);
    for (const l of [0, 1, 3, 4]) conferir.atributo(celula(l, 2), 'data-erro', 'true');
    conferir.nao.atributo(celula(2, 2), 'data-erro', 'true'); // o valor em minoria não é erro
  });
  test('TC-SB-12 linhas completas repetidas marcam as 12 células', async () => {
    const user = await abrirJogo({
      puzzle: VAZIO
    });
    const linha = '001101';
    for (const l of [0, 1]) for (let c = 0; c < 6; c++) await definir(user, l, c, linha[c]);
    for (const l of [0, 1]) for (let c = 0; c < 6; c++) {
      conferir.atributo(celula(l, c), 'data-erro', 'true');
    }
  });
  test('TC-SB-13 colunas completas repetidas marcam as 12 células', async () => {
    const user = await abrirJogo({
      puzzle: VAZIO
    });
    const coluna = '001101';
    for (const c of [0, 1]) for (let l = 0; l < 6; l++) await definir(user, l, c, coluna[l]);
    for (const c of [0, 1]) for (let l = 0; l < 6; l++) {
      conferir.atributo(celula(l, c), 'data-erro', 'true');
    }
  });
  test('TC-SB-14 corrigir a trinca remove as marcas de erro', async () => {
    const user = await abrirJogo({
      puzzle: VAZIO
    });
    for (let c = 0; c < 3; c++) await definir(user, 0, c, '0');
    conferir.atributo(celula(0, 2), 'data-erro', 'true');
    await user.click(celula(0, 2));
    conferir.atributo(celula(0, 2), 'data-valor', '1');
    for (let c = 0; c < 6; c++) conferir.nao.atributo(celula(0, c), 'data-erro', 'true');
  });
  test('TC-SB-18 linhas incompletas iguais não são marcadas como erro', async () => {
    const user = await abrirJogo({
      puzzle: VAZIO
    });
    const linhaIncompleta = '00110';
    for (const l of [0, 1]) for (let c = 0; c < 5; c++) await definir(user, l, c, linhaIncompleta[c]);
    for (const l of [0, 1]) for (let c = 0; c < 5; c++) {
      conferir.atributo(celula(l, c), 'data-valor', linhaIncompleta[c]);
    }
    conferir.quantidade(todasAsCelulas().filter(c => c.getAttribute('data-erro') === 'true'), 0); // nenhuma das 36
  });
});

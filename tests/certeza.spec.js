// Testes das células certas, pintadas de verde (G6). Casos da seção 5 do PLANEJAMENTO.md.
// Modo somente testes: o jogo ainda não existe, então estes testes FALHAM de propósito.
import { abrirJogo, screen, celula, todasAsCelulas, cliqueDireito, P1 } from './helpers.js';
import { conferir } from "./support/verificacoes.js";
describe("Sudoku bin\xE1rio \u2014 certeza", () => {
  test('TC-SB-21 clique direito marca e desmarca a célula como certa', async () => {
    const user = await abrirJogo({
      puzzle: P1
    });
    await user.click(celula(0, 0)); // 0
    await cliqueDireito(user, celula(0, 0));
    conferir.atributo(celula(0, 0), 'data-certa', 'true');
    await cliqueDireito(user, celula(0, 0));
    conferir.nao.atributo(celula(0, 0), 'data-certa', 'true');
    conferir.atributo(celula(0, 0), 'data-valor', '0');
  });
  test('TC-SB-22 célula certa não muda com clique esquerdo', async () => {
    const user = await abrirJogo({
      puzzle: P1
    });
    await user.click(celula(0, 0));
    await cliqueDireito(user, celula(0, 0));
    for (let i = 0; i < 3; i++) {
      await user.click(celula(0, 0));
      conferir.atributo(celula(0, 0), 'data-valor', '0');
      conferir.atributo(celula(0, 0), 'data-certa', 'true');
    }
  });
  test('TC-SB-23 vazias e fixas não podem ser marcadas', async () => {
    const user = await abrirJogo({
      puzzle: P1
    });
    await cliqueDireito(user, celula(0, 1)); // vazia
    await cliqueDireito(user, celula(0, 4)); // fixa (1)
    conferir.nao.atributo(celula(0, 1), 'data-certa', 'true');
    conferir.nao.atributo(celula(0, 4), 'data-certa', 'true');
    await user.click(celula(0, 0));
    await cliqueDireito(user, celula(0, 0)); // preenchida pelo jogador
    conferir.atributo(celula(0, 0), 'data-certa', 'true');
  });
  test('TC-SB-24 Limpar mantém as certas; Novo jogo apaga tudo', async () => {
    const user = await abrirJogo({
      puzzle: P1
    });
    await user.click(celula(0, 0)); // 0
    await cliqueDireito(user, celula(0, 0)); // certa
    await user.click(celula(0, 1));
    await user.click(celula(0, 1)); // 1
    await user.click(screen.getByTestId('btn-limpar'));
    conferir.atributo(celula(0, 0), 'data-valor', '0');
    conferir.atributo(celula(0, 0), 'data-certa', 'true');
    conferir.atributo(celula(0, 1), 'data-valor', '');
    await user.click(screen.getByTestId('btn-novo'));
    conferir.quantidade(todasAsCelulas().filter(c => c.getAttribute('data-certa') === 'true'), 0);
  });
});

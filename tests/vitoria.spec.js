// Testes de vitória (B5). Modo somente testes: falham até o jogo existir.
import { abrirJogo, P1, S1, preencher, celula, todasAsCelulas, screen } from './helpers.js';
import { conferir } from "./support/verificacoes.js";
describe("Sudoku bin\xE1rio \u2014 vitoria", () => {
  test('TC-SB-15 solução válida vence, trava o tabuleiro e para o cronômetro', async () => {
    jest.useFakeTimers(); // relógio falso moderno: inclui Date e performance.now
    try {
      const user = await abrirJogo({
        puzzle: P1
      }, {
        advanceTimers: jest.advanceTimersByTime
      });
      await preencher(user, S1.slice(0, 1) + '.'.repeat(35)); // 1º clique: o cronômetro começa
      jest.advanceTimersByTime(3000);
      await preencher(user, '.' + S1.slice(1));
      conferir.texto(screen.getByTestId('mensagem'), /^Parabéns, você resolveu!$/);
      for (const item of todasAsCelulas()) conferir.nao.atributo(item, 'data-erro', 'true');
      const valorFinal = celula(0, 0).getAttribute('data-valor');
      await user.click(celula(0, 0));
      conferir.atributo(celula(0, 0), 'data-valor', valorFinal);
      const tempoFinal = Number(screen.getByTestId('cronometro').textContent);
      expect(tempoFinal).toBeGreaterThanOrEqual(1);
      jest.advanceTimersByTime(2000);
      conferir.texto(screen.getByTestId('cronometro'), new RegExp(`^${tempoFinal}$`)); // parou
    } finally {
      jest.useRealTimers();
    }
  });
  test('TC-SB-16 tabuleiro completo inválido mostra erros e continua editável', async () => {
    const gradeInvalida = `01${S1.slice(2)}`;
    const user = await abrirJogo({
      puzzle: P1
    });
    await preencher(user, gradeInvalida);
    conferir.nao.texto(screen.getByTestId('mensagem'), /Parabéns, você resolveu!/i);
    conferir.atributo(celula(0, 0), 'data-erro', 'true');
    conferir.atributo(celula(0, 1), 'data-erro', 'true');
    await user.click(celula(0, 0));
    conferir.atributo(celula(0, 0), 'data-valor', '1');
  });
});

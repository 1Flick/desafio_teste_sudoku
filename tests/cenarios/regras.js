// Dados determinísticos e ações reutilizadas nos casos deste domínio.
// Testes das regras do Sudoku binário (B2, B3, B4).
// Modo somente testes: todos falham de propósito enquanto o jogo não existe.
import { abrirJogo, VAZIO, celula, todasAsCelulas } from "../helpers.js";
import { conferir } from "../support/verificacoes.js";
export async function definir(user, l, c, valor) {
  await user.click(celula(l, c));
  if (valor === '1') await user.click(celula(l, c));
}

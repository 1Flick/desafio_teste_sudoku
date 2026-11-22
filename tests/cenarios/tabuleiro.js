// Dados determinísticos e ações reutilizadas nos casos deste domínio.
// Testes do tabuleiro, preenchimento e banco de puzzles (G2, G3, G4). Casos da seção 5 do PLANEJAMENTO.md.
// Modo somente testes: o jogo ainda não existe, então estes testes FALHAM de propósito.
import { abrirJogo, screen, celula, todasAsCelulas, preencher, P1, PUZZLES, S1, VAZIO } from "../helpers.js";
import { conferir } from "../support/verificacoes.js";
export const celulaDoIndice = i => celula(Math.floor(i / 6), i % 6);
/** Padrão das fixas na mesma notação do banco ('.' = não fixa). */
export const padraoDasFixas = () => Array.from({
  length: 36
}, (_, i) => celulaDoIndice(i).getAttribute('data-fixa') === 'true' ? celulaDoIndice(i).getAttribute('data-valor') : '.').join('');

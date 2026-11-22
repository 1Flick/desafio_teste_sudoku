// API dos cenários; ciclo de abertura compartilhado em support/interface.js.
import { criarAbertura, screen, within } from './support/interface.js';
export { cliqueDireito, screen, within } from './support/interface.js';

export const abrirJogo = criarAbertura(() => import('../js/main.js'));


// Banco de puzzles da seção 3 (cada um com solução única). '.' = vazia.
export const P1 = '....1....0...1..1....00..1......11..';
export const P2 = '.....1.1.1.1.1.........1......0..0..';
export const P3 = '..........11..1.1.......11..0......1';
export const P4 = '........0.1.1..1....0...0......1.0.1';
export const P5 = '1.......1......0..1.1..........00...';
export const PUZZLES = [P1, P2, P3, P4, P5];
// Solução S1 (de P1), linha por linha.
export const S1 = '100110011001010110101001010011101100';
// Tabuleiro vazio, para testar as regras à vontade.
export const VAZIO = '.'.repeat(36);

export const celula = (l, c) => screen.getByTestId(`celula-${l}-${c}`);
export const todasAsCelulas = () => screen.getAllByTestId(/^celula-\d-\d$/);

/**
 * Preenche o tabuleiro com `grade` (36 caracteres: '0', '1' ou '.' = não mexer).
 * Células fixas são puladas. 1 clique = 0, 2 cliques = 1.
 */
export async function preencher(user, grade) {
  for (let i = 0; i < 36; i++) {
    const valor = grade[i];
    if (valor === '.') continue;
    const l = Math.floor(i / 6), c = i % 6;
    if (celula(l, c).getAttribute('data-fixa') === 'true') continue;
    const cliques = valor === '0' ? 1 : 2;
    for (let k = 0; k < cliques; k++) await user.click(celula(l, c));
  }
}

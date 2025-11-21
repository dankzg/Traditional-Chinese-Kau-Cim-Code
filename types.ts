export interface Fortune {
  title: string; // e.g., 上上簽
  poem: string[]; // The 4 lines of the poem
  interpretation: string; // The explanation
  meaning: string; // Short summary (e.g., 求財：大利)
}

export type GameState = 'IDLE' | 'SHAKING' | 'DROPPING' | 'REVEALED';

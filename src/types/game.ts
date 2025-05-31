
export type GamePhase = 'welcome' | 'briefing' | 'clue' | 'final';

export interface ClueData {
  text: string;
  checkpoint: number;
}

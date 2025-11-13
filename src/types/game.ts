export type GamePhase = 1 | 2 | 3 | 4 | 5;

export interface PhaseConfig {
  id: GamePhase;
  name: string;
  range: { start: number; end: number };
  color: string;
  unlocked: boolean;
  completed: boolean;
  crystals: number;
}

export interface GameProgress {
  currentPhase: GamePhase;
  phases: Record<GamePhase, PhaseConfig>;
  totalCrystals: number;
  completedGame: boolean;
}

export type MiniGameType = 'find' | 'sequence' | 'complete';

export interface MiniGameProps {
  numbers: number[];
  onComplete: () => void;
}

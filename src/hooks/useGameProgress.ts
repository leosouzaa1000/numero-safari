import { useState, useEffect } from 'react';
import { GameProgress, GamePhase, PhaseConfig } from '@/types/game';

const STORAGE_KEY = 'magicNumbersProgress';

const initialProgress: GameProgress = {
  currentPhase: 1,
  phases: {
    1: { id: 1, name: 'Primeiros Passos', range: { start: 1, end: 10 }, color: 'blue', unlocked: true, completed: false, crystals: 0 },
    2: { id: 2, name: 'Aventura Continua', range: { start: 11, end: 20 }, color: 'green', unlocked: false, completed: false, crystals: 0 },
    3: { id: 3, name: 'Explorador Mágico', range: { start: 21, end: 30 }, color: 'orange', unlocked: false, completed: false, crystals: 0 },
    4: { id: 4, name: 'Mestre dos Números', range: { start: 31, end: 40 }, color: 'pink', unlocked: false, completed: false, crystals: 0 },
    5: { id: 5, name: 'Guardião Final', range: { start: 41, end: 50 }, color: 'purple', unlocked: false, completed: false, crystals: 0 },
  },
  totalCrystals: 0,
  completedGame: false,
};

export function useGameProgress() {
  const [progress, setProgress] = useState<GameProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialProgress;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const completePhase = (phase: GamePhase) => {
    setProgress((prev) => {
      const newPhases = { ...prev.phases };
      newPhases[phase].completed = true;
      newPhases[phase].crystals = 1;

      // Unlock next phase
      if (phase < 5) {
        newPhases[(phase + 1) as GamePhase].unlocked = true;
      }

      const totalCrystals = Object.values(newPhases).reduce((sum, p) => sum + p.crystals, 0);
      const completedGame = phase === 5;

      return {
        ...prev,
        phases: newPhases,
        currentPhase: phase < 5 ? (phase + 1) as GamePhase : phase,
        totalCrystals,
        completedGame,
      };
    });
  };

  const resetProgress = () => {
    setProgress(initialProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProgress));
  };

  return { progress, completePhase, resetProgress };
}

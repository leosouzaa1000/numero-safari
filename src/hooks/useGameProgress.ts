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
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log('Loaded progress from storage:', parsed);
        
        // Merge each phase individually to preserve structure
        const mergedPhases: Record<GamePhase, PhaseConfig> = { ...initialProgress.phases };
        
        if (parsed.phases) {
          (Object.keys(parsed.phases) as unknown as GamePhase[]).forEach((phaseId) => {
            if (mergedPhases[phaseId] && parsed.phases[phaseId]) {
              mergedPhases[phaseId] = {
                ...mergedPhases[phaseId],
                ...parsed.phases[phaseId],
              };
            }
          });
        }
        
        const result = {
          ...initialProgress,
          currentPhase: parsed.currentPhase || initialProgress.currentPhase,
          totalCrystals: parsed.totalCrystals || 0,
          completedGame: parsed.completedGame || false,
          phases: mergedPhases,
        };
        
        console.log('Merged progress:', result);
        return result;
      } catch (error) {
        console.error('Error loading progress:', error);
        return initialProgress;
      }
    }
    return initialProgress;
  });

  useEffect(() => {
    console.log('Saving progress to storage:', progress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const completePhase = (phase: GamePhase) => {
    console.log('completePhase called for phase:', phase);
    
    setProgress((prev) => {
      const newPhases = { ...prev.phases };
      
      // Safely update current phase
      if (newPhases[phase]) {
        newPhases[phase] = {
          ...newPhases[phase],
          completed: true,
          crystals: 1,
        };
        console.log('Phase marked as completed:', phase, newPhases[phase]);
      }

      // Unlock next phase if it exists - ensure we're working with numbers
      const nextPhaseNum = Number(phase) + 1;
      const nextPhase = nextPhaseNum as GamePhase;
      
      if (nextPhaseNum <= 5 && newPhases[nextPhase]) {
        newPhases[nextPhase] = {
          ...newPhases[nextPhase],
          unlocked: true,
        };
        console.log('Next phase unlocked:', nextPhase, newPhases[nextPhase]);
      }

      const totalCrystals = Object.values(newPhases).reduce((sum, p) => sum + p.crystals, 0);
      const completedGame = phase === 5;

      const newProgress = {
        ...prev,
        phases: newPhases,
        currentPhase: nextPhaseNum <= 5 ? nextPhase : phase,
        totalCrystals,
        completedGame,
      };
      
      console.log('New progress state:', newProgress);
      return newProgress;
    });
  };

  const resetProgress = () => {
    setProgress(initialProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProgress));
  };

  return { progress, completePhase, resetProgress };
}

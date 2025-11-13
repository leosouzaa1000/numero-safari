import { useState } from 'react';
import { useGameProgress } from '@/hooks/useGameProgress';
import { GamePhase } from '@/types/game';
import { MagicStar } from '@/components/game/MagicStar';
import { PhaseCard } from '@/components/game/PhaseCard';
import { PhaseScreen } from '@/components/game/PhaseScreen';
import { Certificate } from '@/components/game/Certificate';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

type Screen = 'menu' | 'phase' | 'certificate';

const Index = () => {
  const { progress, completePhase, resetProgress } = useGameProgress();
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [selectedPhase, setSelectedPhase] = useState<GamePhase | null>(null);

  const handlePhaseSelect = (phase: GamePhase) => {
    if (progress.phases[phase].unlocked) {
      setSelectedPhase(phase);
      setCurrentScreen('phase');
    }
  };

  const handlePhaseComplete = () => {
    if (selectedPhase) {
      completePhase(selectedPhase);
      
      if (selectedPhase === 5) {
        setCurrentScreen('certificate');
        setSelectedPhase(null);
      } else {
        // Avança automaticamente para a próxima fase
        const nextPhase = (selectedPhase + 1) as GamePhase;
        setSelectedPhase(nextPhase);
      }
    }
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
    setSelectedPhase(null);
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja recomeçar o jogo?')) {
      resetProgress();
      setCurrentScreen('menu');
      setSelectedPhase(null);
    }
  };

  if (currentScreen === 'certificate') {
    return <Certificate onBack={handleBackToMenu} />;
  }

  if (currentScreen === 'phase' && selectedPhase) {
    return (
      <PhaseScreen
        phase={progress.phases[selectedPhase]}
        onComplete={handlePhaseComplete}
        onBack={handleBackToMenu}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-game-sky via-background to-game-grass">
      {/* Header */}
      <header className="text-center pt-12 pb-8">
        <div className="flex justify-center mb-6">
          <MagicStar size="lg" />
        </div>
        <h1 className="text-6xl font-black text-foreground mb-4 drop-shadow-lg">
          A Missão dos Números Mágicos
        </h1>
        <p className="text-2xl text-muted-foreground">
          Aprenda a contar até 50 e colete todos os cristais!
        </p>
        
        {/* Progress */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="bg-white rounded-full px-8 py-4 shadow-lg flex items-center gap-3">
            <span className="text-3xl">💎</span>
            <span className="text-2xl font-bold text-foreground">
              {progress.totalCrystals} / 5
            </span>
          </div>
        </div>
      </header>

      {/* Phases Grid */}
      <main className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {(Object.keys(progress.phases) as unknown as GamePhase[]).map((phaseId) => (
            <PhaseCard
              key={phaseId}
              phase={progress.phases[phaseId]}
              onSelect={() => handlePhaseSelect(phaseId)}
            />
          ))}
        </div>

        {/* Show certificate option if game completed */}
        {progress.completedGame && (
          <div className="mt-12 text-center">
            <Button
              onClick={() => setCurrentScreen('certificate')}
              size="lg"
              className="text-2xl px-12 py-8 rounded-full bg-gradient-to-r from-game-sun to-game-orange text-white font-black shadow-2xl hover:scale-105 transition-transform"
            >
              🏆 Ver Meu Certificado! 🏆
            </Button>
          </div>
        )}

        {/* Reset Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="rounded-full"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Recomeçar Jogo
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;

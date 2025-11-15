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
    if (!selectedPhase) return;
    
    console.log('handlePhaseComplete called for phase:', selectedPhase);
    
    // Complete the phase first
    completePhase(selectedPhase);
    
    // Check if this is the final phase
    if (selectedPhase === 5) {
      console.log('Game completed! Going to certificate');
      setTimeout(() => {
        setCurrentScreen('certificate');
        setSelectedPhase(null);
      }, 500);
    } else {
      // Automatically advance to next phase - ensure numeric addition
      const nextPhaseNum = Number(selectedPhase) + 1;
      const nextPhase = nextPhaseNum as GamePhase;
      console.log('Auto-advancing to next phase:', nextPhase);
      
      setTimeout(() => {
        setSelectedPhase(nextPhase);
      }, 100);
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
    const phaseConfig = progress.phases[selectedPhase];
    
    console.log('Rendering phase screen:', selectedPhase, phaseConfig);
    
    // Safety check: only render if phase exists
    if (!phaseConfig) {
      console.error('Phase config not found for phase:', selectedPhase);
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Button onClick={handleBackToMenu}>Voltar ao Menu</Button>
        </div>
      );
    }
    
    return (
      <PhaseScreen
        key={selectedPhase}
        phase={phaseConfig}
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

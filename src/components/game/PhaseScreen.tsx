import { useState, useEffect } from 'react';
import { PhaseConfig } from '@/types/game';
import { NumberBubble } from './NumberBubble';
import { FindNumber } from './minigames/FindNumber';
import { SequenceGame } from './minigames/SequenceGame';
import { CompleteSequence } from './minigames/CompleteSequence';
import { useSpeech } from '@/hooks/useSpeech';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Confetti } from './Confetti';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

type PhaseStep = 'learn' | 'find' | 'sequence' | 'complete';

interface PhaseScreenProps {
  phase: PhaseConfig;
  onComplete: () => void;
  onBack: () => void;
}

export function PhaseScreen({ phase, onComplete, onBack }: PhaseScreenProps) {
  const [step, setStep] = useState<PhaseStep>('learn');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { speak, playSound } = useSpeech();
  
  console.log('PhaseScreen rendered with phase:', phase?.id, 'step:', step);
  
  // Safety check
  if (!phase || !phase.range) {
    console.error('Invalid phase data:', phase);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Button onClick={onBack}>Voltar ao Menu</Button>
      </div>
    );
  }
  
  const numbers = Array.from(
    { length: phase.range.end - phase.range.start + 1 },
    (_, i) => phase.range.start + i
  );

  // Reset step when phase changes
  useEffect(() => {
    setStep('learn');
    setShowConfetti(false);
    setShowCelebration(false);
  }, [phase.id]);

  useEffect(() => {
    if (step === 'learn') {
      setTimeout(() => {
        speak(`Vamos aprender os números de ${phase.range.start} até ${phase.range.end}!`);
      }, 500);
    }
  }, [step, phase]);

  const handleLearnComplete = () => {
    speak('Agora vamos praticar!');
    setStep('find');
  };

  const handleMiniGameComplete = () => {
    if (step === 'find') {
      setStep('sequence');
    } else if (step === 'sequence') {
      setStep('complete');
    } else if (step === 'complete') {
      // Show celebration dialog
      setShowConfetti(true);
      playSound('complete');
      speak('Parabéns! Você conquistou um diamante mágico!');
      setShowCelebration(true);
    }
  };

  const handleContinue = () => {
    setShowCelebration(false);
    setShowConfetti(false);
    onComplete();
  };

  const handleBackToMenu = () => {
    setShowCelebration(false);
    setShowConfetti(false);
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-game-sky to-game-grass">
      {showConfetti && <Confetti />}
      
      {/* Celebration Dialog */}
      <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
        <DialogContent className="max-w-2xl border-0 bg-gradient-to-br from-game-sun/95 to-game-orange/95 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-8 py-8">
            <div className="relative">
              <div className="absolute inset-0 animate-ping">
                <Sparkles className="w-32 h-32 text-white" />
              </div>
              <Sparkles className="w-32 h-32 text-white relative z-10" />
            </div>
            
            <h2 className="text-6xl font-black text-white text-center animate-bounce">
              🎉 PARABÉNS! 🎉
            </h2>
            
            <p className="text-3xl font-bold text-white text-center">
              Você conquistou um Diamante Mágico!
            </p>
            
            <div className="w-40 h-40 bg-white/20 rounded-full animate-pulse shadow-2xl flex items-center justify-center backdrop-blur-sm border-4 border-white/50">
              <span className="text-8xl animate-bounce">💎</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full px-4">
              <Button
                onClick={handleContinue}
                size="lg"
                className="flex-1 text-2xl py-8 rounded-full bg-gradient-to-r from-success to-game-green text-white font-black shadow-2xl hover:scale-105 transition-transform border-4 border-white"
              >
                Próxima Fase! 🚀
              </Button>
              
              <Button
                onClick={handleBackToMenu}
                variant="secondary"
                size="lg"
                className="flex-1 text-2xl py-8 rounded-full font-black shadow-xl hover:scale-105 transition-transform border-4 border-white bg-white text-foreground"
              >
                Voltar ao Menu 🏠
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="p-4">
        <Button
          onClick={onBack}
          variant="secondary"
          size="lg"
          className="rounded-full"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Voltar
        </Button>
      </div>

      {step === 'learn' && (
        <div className="flex flex-col items-center gap-8 p-8">
          <h1 className="text-5xl font-black text-foreground text-center">
            {phase.name}
          </h1>
          <p className="text-2xl text-foreground text-center">
            Vamos aprender os números de {phase.range.start} até {phase.range.end}!
          </p>
          
          <div className="grid grid-cols-5 gap-6 max-w-4xl">
            {numbers.map((num) => (
              <NumberBubble
                key={num}
                number={num}
                color={phase.color}
              />
            ))}
          </div>

          <Button
            onClick={handleLearnComplete}
            size="lg"
            className="mt-8 text-2xl px-12 py-8 rounded-full bg-gradient-to-r from-success to-game-green text-white font-black shadow-2xl hover:scale-105 transition-transform"
          >
            Entendi! Vamos Praticar! ✨
          </Button>
        </div>
      )}

      {step === 'find' && (
        <FindNumber numbers={numbers} onComplete={handleMiniGameComplete} />
      )}

      {step === 'sequence' && (
        <SequenceGame numbers={numbers} onComplete={handleMiniGameComplete} />
      )}

      {step === 'complete' && (
        <CompleteSequence numbers={numbers} onComplete={handleMiniGameComplete} />
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { PhaseConfig } from '@/types/game';
import { NumberBubble } from './NumberBubble';
import { FindNumber } from './minigames/FindNumber';
import { SequenceGame } from './minigames/SequenceGame';
import { CompleteSequence } from './minigames/CompleteSequence';
import { useSpeech } from '@/hooks/useSpeech';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Confetti } from './Confetti';

type PhaseStep = 'learn' | 'find' | 'sequence' | 'complete';

interface PhaseScreenProps {
  phase: PhaseConfig;
  onComplete: () => void;
  onBack: () => void;
}

export function PhaseScreen({ phase, onComplete, onBack }: PhaseScreenProps) {
  const [step, setStep] = useState<PhaseStep>('learn');
  const [showConfetti, setShowConfetti] = useState(false);
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
      // Show quick celebration and move to next phase
      setShowConfetti(true);
      playSound('complete');
      speak('Parabéns! Cristal conquistado!');
      
      setTimeout(() => {
        setShowConfetti(false);
        onComplete();
      }, 1500); // Reduced time for faster flow
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-game-sky to-game-grass">
      {showConfetti && <Confetti />}
      
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

import { useState, useEffect } from 'react';
import { NumberBubble } from '../NumberBubble';
import { useSpeech } from '@/hooks/useSpeech';
import { MiniGameProps } from '@/types/game';
import { Button } from '@/components/ui/button';

export function FindNumber({ numbers, onComplete }: MiniGameProps) {
  const [targetNumber, setTargetNumber] = useState<number>(numbers[0]);
  const [shuffledNumbers, setShuffledNumbers] = useState<number[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const { speak, playSound } = useSpeech();

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    const shuffled = [...numbers].sort(() => Math.random() - 0.5);
    setShuffledNumbers(shuffled);
    const newTarget = shuffled[Math.floor(Math.random() * shuffled.length)];
    setTargetNumber(newTarget);
    setTimeout(() => speak(`Encontre o número ${newTarget}`), 500);
  };

  const handleNumberClick = (number: number) => {
    if (number === targetNumber) {
      playSound('success');
      speak('Muito bem!');
      const newCount = correctCount + 1;
      setCorrectCount(newCount);
      
      if (newCount >= 3) {
        setTimeout(onComplete, 1000);
      } else {
        setTimeout(startNewRound, 1500);
      }
    } else {
      playSound('pop');
      speak('Tente novamente!');
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <h2 className="text-4xl font-black text-foreground mb-4">Encontre o Número!</h2>
        <div className="text-8xl font-black text-primary animate-pulse">
          {targetNumber}
        </div>
        <div className="mt-4 flex gap-2 justify-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${
                i < correctCount ? 'bg-success' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6 max-w-4xl">
        {shuffledNumbers.map((num) => (
          <NumberBubble
            key={num}
            number={num}
            onClick={() => handleNumberClick(num)}
            color="blue"
          />
        ))}
      </div>
    </div>
  );
}

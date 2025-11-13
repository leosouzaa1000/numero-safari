import { useState, useEffect } from 'react';
import { NumberBubble } from '../NumberBubble';
import { useSpeech } from '@/hooks/useSpeech';
import { MiniGameProps } from '@/types/game';

export function SequenceGame({ numbers, onComplete }: MiniGameProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [shuffled, setShuffled] = useState<number[]>([]);
  const { speak, playSound } = useSpeech();

  useEffect(() => {
    const shuffledNums = [...numbers].sort(() => Math.random() - 0.5);
    setShuffled(shuffledNums);
    speak('Coloque os números na ordem certa!');
  }, [numbers]);

  const handleNumberClick = (number: number) => {
    const expectedNext = numbers[sequence.length];
    
    if (number === expectedNext) {
      playSound('success');
      const newSequence = [...sequence, number];
      setSequence(newSequence);
      setShuffled(shuffled.filter(n => n !== number));
      
      if (newSequence.length === numbers.length) {
        speak('Perfeito! Você acertou tudo!');
        playSound('complete');
        setTimeout(onComplete, 2000);
      }
    } else {
      playSound('pop');
      speak('Ops! Tente outro número!');
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <h2 className="text-4xl font-black text-foreground mb-4">Sequência Mágica!</h2>
        <p className="text-xl text-muted-foreground">Coloque os números em ordem</p>
      </div>

      {/* Sequence so far */}
      <div className="flex gap-4 min-h-32 items-center justify-center flex-wrap max-w-4xl">
        {sequence.map((num, idx) => (
          <NumberBubble
            key={`seq-${num}`}
            number={num}
            color="green"
            disabled
          />
        ))}
        {sequence.length < numbers.length && (
          <div className="w-24 h-24 border-4 border-dashed border-primary rounded-full flex items-center justify-center text-6xl text-muted-foreground">
            ?
          </div>
        )}
      </div>

      {/* Available numbers */}
      <div className="grid grid-cols-5 gap-6 max-w-4xl">
        {shuffled.map((num) => (
          <NumberBubble
            key={num}
            number={num}
            onClick={() => handleNumberClick(num)}
            color="purple"
          />
        ))}
      </div>
    </div>
  );
}

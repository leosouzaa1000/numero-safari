import { useState, useEffect } from 'react';
import { NumberBubble } from '../NumberBubble';
import { useSpeech } from '@/hooks/useSpeech';
import { MiniGameProps } from '@/types/game';

export function CompleteSequence({ numbers, onComplete }: MiniGameProps) {
  const [sequence, setSequence] = useState<(number | null)[]>([]);
  const [options, setOptions] = useState<number[]>([]);
  const [missingIndex, setMissingIndex] = useState<number>(0);
  const { speak, playSound } = useSpeech();

  useEffect(() => {
    // Create sequence with one missing number
    const missing = Math.floor(Math.random() * numbers.length);
    const seq = numbers.map((n, i) => (i === missing ? null : n));
    setSequence(seq);
    setMissingIndex(missing);
    
    // Create options (correct answer + 2 wrong ones)
    const correct = numbers[missing];
    const wrong1 = correct + 10;
    const wrong2 = correct - 10;
    const opts = [correct, wrong1, wrong2].sort(() => Math.random() - 0.5);
    setOptions(opts);
    
    setTimeout(() => speak(`Qual número está faltando?`), 500);
  }, [numbers]);

  const handleOptionClick = (number: number) => {
    const correct = numbers[missingIndex];
    
    if (number === correct) {
      playSound('complete');
      speak('Excelente! Você completou a sequência!');
      const newSeq = [...sequence];
      newSeq[missingIndex] = number;
      setSequence(newSeq);
      setTimeout(onComplete, 2000);
    } else {
      playSound('pop');
      speak('Tente novamente!');
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <h2 className="text-4xl font-black text-foreground mb-4">Complete a Linha!</h2>
        <p className="text-xl text-muted-foreground">Qual número está faltando?</p>
      </div>

      {/* Sequence with missing number */}
      <div className="flex gap-4 items-center justify-center flex-wrap max-w-4xl">
        {sequence.map((num, idx) => (
          num === null ? (
            <div
              key={`missing-${idx}`}
              className="w-24 h-24 border-4 border-dashed border-accent rounded-full flex items-center justify-center text-6xl text-accent animate-pulse"
            >
              ?
            </div>
          ) : (
            <NumberBubble
              key={`seq-${idx}`}
              number={num}
              color="orange"
              disabled
            />
          )
        ))}
      </div>

      {/* Options */}
      <div className="flex gap-8 mt-8">
        {options.map((num) => (
          <NumberBubble
            key={num}
            number={num}
            onClick={() => handleOptionClick(num)}
            color="pink"
            size="lg"
          />
        ))}
      </div>
    </div>
  );
}

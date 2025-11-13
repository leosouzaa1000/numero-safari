import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  delay: number;
}

export function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const colors = ['bg-game-pink', 'bg-game-sun', 'bg-game-blue', 'bg-game-purple', 'bg-game-orange'];
    const newPieces = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={`absolute w-3 h-3 ${piece.color} rounded-full confetti-pop`}
          style={{
            left: `${piece.left}%`,
            top: '50%',
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

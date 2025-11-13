import { Lock, Star } from 'lucide-react';
import { PhaseConfig } from '@/types/game';
import { Button } from '@/components/ui/button';

interface PhaseCardProps {
  phase: PhaseConfig;
  onSelect: () => void;
}

export function PhaseCard({ phase, onSelect }: PhaseCardProps) {
  const colorClasses = {
    blue: 'from-game-blue to-primary',
    green: 'from-game-green to-success',
    orange: 'from-game-orange to-game-sun',
    pink: 'from-game-pink to-accent',
    purple: 'from-primary to-game-purple',
  };

  return (
    <div className="relative">
      <Button
        onClick={onSelect}
        disabled={!phase.unlocked}
        className={`
          w-full h-48 flex flex-col items-center justify-center gap-4
          bg-gradient-to-br ${colorClasses[phase.color as keyof typeof colorClasses]}
          text-white font-bold text-xl
          rounded-3xl shadow-2xl
          border-4 border-white
          transition-all duration-300
          ${phase.unlocked ? 'hover:scale-105 hover:shadow-3xl' : 'opacity-60'}
          relative overflow-hidden
        `}
      >
        {!phase.unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Lock className="w-16 h-16" />
          </div>
        )}
        
        <div className="text-3xl font-black">{phase.name}</div>
        <div className="text-6xl font-black">
          {phase.range.start} - {phase.range.end}
        </div>
        
        {phase.completed && (
          <div className="absolute top-4 right-4">
            <Star className="w-12 h-12 fill-game-sun text-game-sun" />
          </div>
        )}
      </Button>
      
      {phase.crystals > 0 && (
        <div className="absolute -top-3 -right-3 bg-success text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl border-4 border-white shadow-lg">
          {phase.crystals}
        </div>
      )}
    </div>
  );
}

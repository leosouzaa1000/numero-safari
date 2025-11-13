import { Sparkles } from 'lucide-react';

interface MagicStarProps {
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export function MagicStar({ size = 'md', animate = true }: MagicStarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className={`${sizeClasses[size]} relative ${animate ? 'star-sparkle' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-game-sun to-game-orange rounded-full animate-pulse" />
      <Sparkles className="w-full h-full relative z-10 text-white drop-shadow-lg" />
    </div>
  );
}

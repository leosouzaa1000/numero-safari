import { useState } from 'react';
import { useSpeech } from '@/hooks/useSpeech';

interface NumberBubbleProps {
  number: number;
  onClick?: () => void;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function NumberBubble({ 
  number, 
  onClick, 
  color = 'primary',
  size = 'md',
  disabled = false 
}: NumberBubbleProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { speak, playSound } = useSpeech();

  const sizeClasses = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-4xl',
    lg: 'w-32 h-32 text-5xl',
  };

  const colorClasses = {
    primary: 'from-primary to-accent',
    blue: 'from-game-blue to-primary',
    green: 'from-game-green to-success',
    orange: 'from-game-orange to-game-sun',
    pink: 'from-game-pink to-accent',
    purple: 'from-primary to-game-purple',
  };

  const handleClick = () => {
    if (disabled) return;
    
    setIsAnimating(true);
    playSound('pop');
    speak(number.toString());
    onClick?.();
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        number-bubble ${sizeClasses[size]}
        bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses] || colorClasses.primary}
        ${isAnimating ? 'bounce-in' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        flex items-center justify-center
        border-4 border-white
        shadow-xl
      `}
    >
      {number}
    </button>
  );
}

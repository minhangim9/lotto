import React from 'react';
import { getBallColorClass } from '../data/lottoData';

interface LottoBallProps {
  number: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isBonus?: boolean;
  highlight?: boolean;
  animateIn?: boolean;
  animationDelay?: number;
  onClick?: () => void;
}

export const LottoBall: React.FC<LottoBallProps> = ({
  number,
  size = 'md',
  isBonus = false,
  highlight = false,
  animateIn = false,
  animationDelay = 0,
  onClick
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs shadow-md',
    md: 'w-10 h-10 text-sm sm:w-11 sm:h-11 sm:text-base shadow-lg',
    lg: 'w-12 h-12 text-base sm:w-14 sm:h-14 sm:text-lg shadow-xl',
    xl: 'w-14 h-14 text-lg sm:w-16 sm:h-16 sm:text-xl shadow-2xl'
  }[size];

  const colorClass = isBonus ? 'ball-gold' : getBallColorClass(number);

  return (
    <div
      onClick={onClick}
      style={{
        animationDelay: `${animationDelay}ms`,
      }}
      className={`
        ball-3d ${colorClass} ${sizeClasses}
        ${highlight ? 'ring-2 ring-yellow-300 ring-offset-2 ring-offset-luxury-black scale-105' : ''}
        ${animateIn ? 'animate-[bounce_0.6s_cubic-bezier(0.34,1.56,0.64,1)_both]' : ''}
        ${onClick ? 'cursor-pointer hover:scale-110 active:scale-95' : ''}
        font-black tracking-tight select-none
      `}
    >
      <span className="relative z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">
        {number}
      </span>
      {isBonus && (
        <span className="absolute -top-1.5 -right-1 text-[9px] bg-red-600 text-white font-bold px-1 rounded-full shadow border border-luxury-gold">
          +
        </span>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { X, Lock, Ban, RotateCcw, Check } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { getBallColorHex } from '../data/lottoData';

interface NumberFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  fixedNumbers: number[];
  excludedNumbers: number[];
  onApplyFilters: (fixed: number[], excluded: number[]) => void;
}

export const NumberFilterModal: React.FC<NumberFilterModalProps> = ({
  isOpen,
  onClose,
  fixedNumbers,
  excludedNumbers,
  onApplyFilters,
}) => {
  const [fixed, setFixed] = useState<number[]>(fixedNumbers);
  const [excluded, setExcluded] = useState<number[]>(excludedNumbers);
  const [activeMode, setActiveMode] = useState<'FIXED' | 'EXCLUDED'>('FIXED');

  if (!isOpen) return null;

  const toggleNumber = (num: number) => {
    soundEngine.playClick();
    if (activeMode === 'FIXED') {
      if (fixed.includes(num)) {
        setFixed(fixed.filter(n => n !== num));
      } else {
        if (fixed.length >= 5) {
          alert('고정수는 최대 5개까지 지정할 수 있습니다.');
          return;
        }
        // Remove from excluded if present
        setExcluded(excluded.filter(n => n !== num));
        setFixed([...fixed, num].sort((a, b) => a - b));
      }
    } else {
      // EXCLUDED mode
      if (excluded.includes(num)) {
        setExcluded(excluded.filter(n => n !== num));
      } else {
        if (excluded.length >= 35) {
          alert('제외수는 최대 35개까지 지정할 수 있습니다.');
          return;
        }
        // Remove from fixed if present
        setFixed(fixed.filter(n => n !== num));
        setExcluded([...excluded, num].sort((a, b) => a - b));
      }
    }
  };

  const handleReset = () => {
    soundEngine.playClick();
    setFixed([]);
    setExcluded([]);
  };

  const handleSave = () => {
    soundEngine.playClick();
    onApplyFilters(fixed, excluded);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#181926] to-[#0A0B10] border border-luxury-gold/40 rounded-2xl shadow-2xl p-5 text-gray-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-gold-gradient">
              VIP 고정수 & 제외수 설정
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              원하는 번호를 반드시 포함하거나 배제합니다.
            </p>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="text-gray-400 hover:text-white p-1 rounded-full bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 my-4">
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveMode('FIXED');
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition ${
              activeMode === 'FIXED'
                ? 'bg-luxury-gold text-luxury-black shadow-gold-sm'
                : 'bg-white/5 text-gray-400 border border-white/10'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>고정수 지정 ({fixed.length}/5)</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveMode('EXCLUDED');
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition ${
              activeMode === 'EXCLUDED'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white/5 text-gray-400 border border-white/10'
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            <span>제외수 지정 ({excluded.length}/35)</span>
          </button>
        </div>

        {/* Instruction badge */}
        <div className="text-[11px] text-gray-400 bg-black/40 p-2.5 rounded-lg border border-white/5 mb-3 flex items-center justify-between">
          <span>
            {activeMode === 'FIXED' ? (
              <span className="text-luxury-gold">★ 생성 시 무조건 포함될 번호를 터치하세요</span>
            ) : (
              <span className="text-red-400">✕ 생성 시 무조건 제외될 번호를 터치하세요</span>
            )}
          </span>
          <button
            onClick={handleReset}
            className="text-gray-400 hover:text-white flex items-center gap-1 text-[10px] underline"
          >
            <RotateCcw className="w-3 h-3" />
            초기화
          </button>
        </div>

        {/* 1~45 Number Grid */}
        <div className="grid grid-cols-7 gap-2 my-2">
          {Array.from({ length: 45 }, (_, i) => i + 1).map((n) => {
            const isFixed = fixed.includes(n);
            const isExcluded = excluded.includes(n);
            const hex = getBallColorHex(n);

            return (
              <button
                key={n}
                onClick={() => toggleNumber(n)}
                style={{
                  borderColor: isFixed ? '#D4AF37' : isExcluded ? '#EF4444' : 'rgba(255,255,255,0.1)'
                }}
                className={`
                  relative h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all border
                  ${
                    isFixed
                      ? 'bg-luxury-gold/30 text-yellow-300 ring-2 ring-luxury-gold font-black scale-105'
                      : isExcluded
                      ? 'bg-red-950/40 text-red-400 opacity-40 line-through'
                      : 'bg-[#151722] text-gray-200 hover:bg-[#202230]'
                  }
                `}
              >
                {/* Tiny color indicator dot */}
                <span
                  className="w-1.5 h-1.5 rounded-full absolute top-1 left-1"
                  style={{ backgroundColor: hex }}
                />
                {n}
                {isFixed && <Lock className="w-2.5 h-2.5 absolute bottom-1 right-1 text-luxury-gold" />}
                {isExcluded && <Ban className="w-2.5 h-2.5 absolute bottom-1 right-1 text-red-500" />}
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="mt-5 grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 font-semibold text-xs"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="py-2.5 rounded-xl gold-glow-button text-luxury-black font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>설정 적용하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

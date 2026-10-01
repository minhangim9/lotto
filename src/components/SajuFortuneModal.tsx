import React, { useState } from 'react';
import { X, Sparkles, Compass, Check, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { LottoBall } from './LottoBall';

interface SajuFortuneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyLuckyNumbers: (numbers: number[]) => void;
}

export const SajuFortuneModal: React.FC<SajuFortuneModalProps> = ({
  isOpen,
  onClose,
  onApplyLuckyNumbers,
}) => {
  const [birthYear, setBirthYear] = useState('1990');
  const [birthMonth, setBirthMonth] = useState('7');
  const [birthDay, setBirthDay] = useState('15');
  const [isCalculated, setIsCalculated] = useState(false);
  const [sajuResult, setSajuResult] = useState<{
    element: string;
    elementDesc: string;
    wealthScore: number;
    luckyNumbers: number[];
    advice: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleCalculate = () => {
    soundEngine.playSpin(1.0);
    const y = parseInt(birthYear, 10) || 1990;
    const m = parseInt(birthMonth, 10) || 1;
    const d = parseInt(birthDay, 10) || 1;

    // Deterministic pseudo-saju calculation
    const seed = y * 10000 + m * 100 + d;
    const elements = [
      { name: '황금(金)의 기운', desc: '결단력과 단단한 금전 재물운을 관장하는 강한 천기', base: [7, 18, 27, 33, 38, 43] },
      { name: '목(木)의 기운', desc: '새로운 싹을 틔우듯 번창하고 확장되는 상승 재물운', base: [3, 8, 12, 21, 35, 41] },
      { name: '수(水)의 기운', desc: '막힘없이 유연하게 큰 강물처럼 흘러들어오는 대박운', base: [1, 6, 14, 26, 34, 45] },
      { name: '화(火)의 기운', desc: '태양처럼 폭발적인 행운과 일확천금을 불러오는 불의 기운', base: [2, 9, 17, 23, 37, 44] },
      { name: '토(土)의 기운', desc: '풍요로운 대지처럼 재산을 단단히 축적하는 안정적 부자운', base: [5, 10, 16, 25, 30, 42] },
    ];

    const elementIndex = (y + m + d) % elements.length;
    const selected = elements[elementIndex];

    // Compute 6 unique numbers
    const setNums = new Set<number>();
    selected.base.forEach(n => setNums.add(n));
    let extra = 1;
    while (setNums.size < 6) {
      setNums.add(((seed + extra * 7) % 45) + 1);
      extra++;
    }

    const luckyNumbers = Array.from(setNums).sort((a, b) => a - b);
    const wealthScore = 88 + (seed % 12); // 88 ~ 99

    setSajuResult({
      element: selected.name,
      elementDesc: selected.desc,
      wealthScore,
      luckyNumbers,
      advice: '재물운의 문이 크게 열리는 형국입니다. 특히 남서쪽 방향에서 구입하거나 목요일~금요일 시간대에 강한 에너지가 깃듭니다.'
    });

    setIsCalculated(true);
    soundEngine.playJackpot();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#1E1B2E] via-[#12111D] to-[#0A0A10] border border-amber-500/40 rounded-2xl shadow-2xl p-5 text-gray-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/40 text-amber-400">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gold-gradient">
                천기누설 사주 & 오행 맞춤 로또
              </h3>
              <p className="text-[11px] text-gray-400">
                타고난 생년월일 명식에 맞춘 평생 재물운수
              </p>
            </div>
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

        {/* Input Form */}
        <div className="my-4 space-y-3">
          <label className="text-xs font-bold text-gray-300 block">
            생년월일(양력)을 입력하세요
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="text-[10px] text-gray-400 block mb-1">출생년도</span>
              <input
                type="number"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder="1990"
                className="w-full bg-black/50 border border-luxury-gold/30 rounded-xl p-2.5 text-xs text-center text-white focus:outline-none focus:border-luxury-gold"
              />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block mb-1">월</span>
              <input
                type="number"
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                min="1"
                max="12"
                placeholder="7"
                className="w-full bg-black/50 border border-luxury-gold/30 rounded-xl p-2.5 text-xs text-center text-white focus:outline-none focus:border-luxury-gold"
              />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block mb-1">일</span>
              <input
                type="number"
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                min="1"
                max="31"
                placeholder="15"
                className="w-full bg-black/50 border border-luxury-gold/30 rounded-xl p-2.5 text-xs text-center text-white focus:outline-none focus:border-luxury-gold"
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full py-3 rounded-xl gold-glow-button text-luxury-black font-black text-xs flex items-center justify-center gap-2 mt-2 shadow-gold-sm"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>내 사주에 맞는 1등 재물 행운수 도출</span>
          </button>
        </div>

        {/* Calculated Result */}
        {isCalculated && sajuResult && (
          <div className="p-4 rounded-2xl bg-black/50 border border-luxury-gold/30 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <span className="text-[10px] text-amber-400 font-bold block">
                  당신의 수호 오행
                </span>
                <span className="text-base font-black text-white">
                  {sajuResult.element}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block">금전 재물운 지수</span>
                <span className="text-lg font-black text-yellow-300">
                  {sajuResult.wealthScore}점 / 100
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              {sajuResult.elementDesc}
            </p>

            {/* Lucky 6 Balls */}
            <div className="py-2 text-center bg-black/60 rounded-xl border border-luxury-gold/20">
              <span className="text-[11px] text-luxury-gold font-bold block mb-2">
                사주 매칭 6대 황금 행운수
              </span>
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                {sajuResult.luckyNumbers.map((n) => (
                  <LottoBall key={n} number={n} size="md" />
                ))}
              </div>
            </div>

            <div className="text-[11px] text-gray-400 bg-amber-950/20 p-2 rounded-lg border border-amber-800/30">
              💡 {sajuResult.advice}
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                onApplyLuckyNumbers(sajuResult.luckyNumbers);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-luxury-gold/20 hover:bg-luxury-gold/30 border border-luxury-gold text-luxury-gold font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Check className="w-4 h-4" />
              <span>이 번호들을 추첨기에 고정수로 즉시 적용</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

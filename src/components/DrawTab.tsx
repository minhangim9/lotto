import React, { useState } from 'react';
import { LottoSphere3D } from './LottoSphere3D';
import { LottoBall } from './LottoBall';
import type { GeneratedGame, AIStrategyId } from '../services/aiEngine';
import { STRATEGIES, AILottoEngine } from '../services/aiEngine';
import { soundEngine } from '../utils/audio';
import { Sparkles, BookmarkPlus, Share2, RefreshCw, Zap, SlidersHorizontal, Check, Compass, TrendingUp, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DrawTabProps {
  currentStrategy: AIStrategyId;
  fixedNumbers: number[];
  excludedNumbers: number[];
  gameCount: number;
  onSaveGames: (games: GeneratedGame[]) => void;
  onOpenReceipt: (games: GeneratedGame[], strategyName: string) => void;
  onOpenFilterModal: () => void;
  onNavigateToAILab: () => void;
  onOpenBacktest: () => void;
  onOpenSaju: () => void;
  onOpenCommercial: () => void;
}

export const DrawTab: React.FC<DrawTabProps> = ({
  currentStrategy,
  fixedNumbers,
  excludedNumbers,
  gameCount,
  onSaveGames,
  onOpenReceipt,
  onOpenFilterModal,
  onNavigateToAILab,
  onOpenBacktest,
  onOpenSaju,
  onOpenCommercial,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [drawnGames, setDrawnGames] = useState<GeneratedGame[]>([]);
  const [revealedCount, setRevealedCount] = useState<number>(6);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const stratInfo = STRATEGIES.find(s => s.id === currentStrategy) || STRATEGIES[0];

  const handleStartDraw = () => {
    if (isSpinning) return;

    soundEngine.playSpin(2.5);
    setIsSpinning(true);
    setRevealedCount(0);
    setSavedSuccess(false);

    // Compute games through AI engine
    const newGames = AILottoEngine.generateBatch(currentStrategy, gameCount, {
      fixedNumbers,
      excludedNumbers
    });

    setDrawnGames(newGames);

    // Progressive sequential ball reveal animation
    const revealInterval = 380;
    for (let i = 1; i <= 6; i++) {
      setTimeout(() => {
        soundEngine.playBallDrop(1 + i * 0.1);
        setRevealedCount(i);

        if (i === 6) {
          setIsSpinning(false);
          soundEngine.playJackpot();
          confetti({
            particleCount: 75,
            spread: 60,
            origin: { y: 0.65 },
            colors: ['#D4AF37', '#FFE072', '#FFFFFF', '#FF6B6B']
          });
        }
      }, 1200 + i * revealInterval);
    }
  };

  const primaryGame = drawnGames[0];

  return (
    <div className="space-y-3.5">
      {/* Top Strategy Selector Bar */}
      <div className="p-3 rounded-2xl gold-glass border border-luxury-gold/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center border border-luxury-gold/40 text-luxury-gold">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">
                {stratInfo.name}
              </span>
              <span className="text-[10px] bg-luxury-gold/20 text-luxury-gold px-1.5 py-0.5 rounded font-bold">
                {gameCount}게임
              </span>
            </div>
            <span className="text-[10px] text-gray-400 block">
              {stratInfo.badge}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenFilterModal();
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
            title="고정수/제외수 필터"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              onNavigateToAILab();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-luxury-gold/15 hover:bg-luxury-gold/25 border border-luxury-gold/30 text-luxury-gold text-xs font-bold"
          >
            전략 변경
          </button>
        </div>
      </div>

      {/* Quick VIP Feature Pills */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenSaju();
          }}
          className="p-2 rounded-xl bg-[#171622] hover:bg-[#201F30] border border-amber-500/30 flex items-center justify-center gap-1.5 text-[11px] font-bold text-amber-300 transition"
        >
          <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span>사주 맞춤 로또</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenBacktest();
          }}
          className="p-2 rounded-xl bg-[#141822] hover:bg-[#1A2030] border border-blue-500/30 flex items-center justify-center gap-1.5 text-[11px] font-bold text-blue-300 transition"
        >
          <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
          <span>AI 백테스팅</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenCommercial();
          }}
          className="p-2 rounded-xl bg-[#1C1A14] hover:bg-[#252219] border border-luxury-gold/40 flex items-center justify-center gap-1.5 text-[11px] font-bold text-luxury-gold transition"
        >
          <Award className="w-3.5 h-3.5 text-yellow-400" />
          <span>100만원 사양서</span>
        </button>
      </div>

      {/* 3D Realistic Physics Lotto Machine */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#141522] via-[#0D0E16] to-[#08090C] border border-luxury-gold/35 shadow-2xl p-2 overflow-hidden">
        {/* Glow ambient background effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-luxury-gold/10 rounded-full blur-3xl pointer-events-none" />

        <LottoSphere3D isSpinning={isSpinning} drawnBalls={[]} />

        {/* Draw Trigger Button */}
        <div className="px-4 pb-3 pt-1">
          <button
            onClick={handleStartDraw}
            disabled={isSpinning}
            className={`
              w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all
              ${
                isSpinning
                  ? 'bg-gray-800 text-gray-400 cursor-not-allowed border border-white/10 animate-pulse'
                  : 'gold-glow-button text-luxury-black shadow-gold-lg hover:brightness-110 active:scale-95'
              }
            `}
          >
            <Sparkles className="w-5 h-5 fill-current" />
            <span>{isSpinning ? 'AI 퀀텀 알고리즘 연산 및 추첨 중...' : '1등 번호 AI 추첨 시작'}</span>
          </button>
        </div>
      </div>

      {/* Primary Game Result Display */}
      {primaryGame && (
        <div className="p-4 rounded-2xl gold-glass border border-luxury-gold/40 shadow-xl space-y-3 animate-fade-in">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5 text-luxury-gold font-bold">
              <span className="w-2 h-2 rounded-full bg-luxury-gold animate-ping" />
              <span>MAIN A조 AI 분석 추천</span>
            </div>
            <div className="text-right">
              <span className="text-gray-400 text-[11px]">AI 적합도 </span>
              <span className="text-yellow-300 font-bold">{primaryGame.confidenceScore}%</span>
            </div>
          </div>

          {/* 6 Large Balls */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 py-2">
            {primaryGame.numbers.slice(0, revealedCount).map((num, idx) => (
              <LottoBall
                key={num}
                number={num}
                size="lg"
                animateIn
                animationDelay={idx * 100}
              />
            ))}
            {/* Placeholders if still revealing */}
            {Array.from({ length: 6 - revealedCount }).map((_, idx) => (
              <div
                key={idx}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-dashed border-luxury-gold/30 bg-black/40 flex items-center justify-center text-luxury-gold/50 font-black animate-pulse"
              >
                ?
              </div>
            ))}
          </div>

          {/* AI Metrics Badges */}
          {revealedCount === 6 && (
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                  <div className="text-[10px] text-gray-400">총합계</div>
                  <div className="font-bold text-yellow-300">{primaryGame.sum}</div>
                </div>
                <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                  <div className="text-[10px] text-gray-400">홀수:짝수</div>
                  <div className="font-bold text-white">{primaryGame.oddEven}</div>
                </div>
                <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                  <div className="text-[10px] text-gray-400">저고비율</div>
                  <div className="font-bold text-white">{primaryGame.highLow}</div>
                </div>
                <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                  <div className="text-[10px] text-gray-400">AC 복잡도</div>
                  <div className="font-bold text-yellow-300">{primaryGame.acValue}</div>
                </div>
              </div>

              {/* AI Diagnoses tags */}
              <div className="flex flex-wrap gap-1.5 justify-center pt-1">
                {primaryGame.aiNotes.map((note, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2.5 py-0.5 rounded-full bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30 font-medium"
                  >
                    ✓ {note}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Additional batch games (B, C, D, E) */}
      {drawnGames.length > 1 && revealedCount === 6 && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-gray-400 px-1">
            추가 세트 번호 ({drawnGames.length - 1}게임)
          </div>
          {drawnGames.slice(1).map((game, i) => {
            const letter = ['B', 'C', 'D', 'E'][i];
            return (
              <div
                key={i}
                className="p-3 rounded-xl gold-glass border border-luxury-gold/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-luxury-gold/20 text-luxury-gold font-bold text-xs flex items-center justify-center border border-luxury-gold/30">
                    {letter}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {game.numbers.map((n) => (
                      <LottoBall key={n} number={n} size="sm" />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-yellow-400 font-bold block">{game.confidenceScore}%</span>
                  <span className="text-[9px] text-gray-400">합 {game.sum}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Buttons: Save & Receipt */}
      {drawnGames.length > 0 && revealedCount === 6 && (
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => {
              soundEngine.playClick();
              onSaveGames(drawnGames);
              setSavedSuccess(true);
              setTimeout(() => setSavedSuccess(false), 2500);
            }}
            className="py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span>저장 완료!</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4 text-yellow-400" />
                <span>보관함 저장</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenReceipt(drawnGames, stratInfo.name);
            }}
            className="py-3 rounded-xl bg-luxury-gold/20 hover:bg-luxury-gold/30 border border-luxury-gold/50 text-luxury-gold font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>VIP 영수증</span>
          </button>

          <button
            onClick={handleStartDraw}
            className="py-3 rounded-xl gold-glow-button text-luxury-black font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>다시 추첨</span>
          </button>
        </div>
      )}
    </div>
  );
};

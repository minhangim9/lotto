import type { AIStrategyId, StrategyInfo } from '../services/aiEngine';
import { STRATEGIES } from '../services/aiEngine';
import { Brain, Sliders, CheckCircle2, ChevronRight, Lock, Ban } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface AILabTabProps {
  selectedStrategy: AIStrategyId;
  onSelectStrategy: (id: AIStrategyId) => void;
  fixedNumbers: number[];
  excludedNumbers: number[];
  onOpenFilterModal: () => void;
  gameCount: number;
  onChangeGameCount: (count: number) => void;
  onGenerateAndGoDraw: () => void;
}

export const AILabTab: React.FC<AILabTabProps> = ({
  selectedStrategy,
  onSelectStrategy,
  fixedNumbers,
  excludedNumbers,
  onOpenFilterModal,
  gameCount,
  onChangeGameCount,
  onGenerateAndGoDraw,
}) => {
  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-gold/15 border border-luxury-gold/30 text-luxury-gold text-xs font-semibold mb-2">
          <Brain className="w-3.5 h-3.5" />
          Quantum AI Recommendation Engine
        </div>
        <h2 className="text-xl font-black text-gold-gradient">
          AI 1등 전략 연구소
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          수학적 확률 분포와 패턴을 계산하는 5대 프리미엄 엔진을 선택하세요.
        </p>
      </div>

      {/* 5 Strategy Cards */}
      <div className="space-y-2.5">
        {STRATEGIES.map((strat: StrategyInfo) => {
          const isSelected = strat.id === selectedStrategy;
          return (
            <div
              key={strat.id}
              onClick={() => {
                soundEngine.playClick();
                onSelectStrategy(strat.id);
              }}
              style={{
                borderColor: isSelected ? strat.accentColor : 'rgba(212, 175, 55, 0.15)'
              }}
              className={`
                p-4 rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden border
                ${
                  isSelected
                    ? 'bg-gradient-to-r from-luxury-card2 via-[#232115] to-luxury-card shadow-gold-md scale-[1.01]'
                    : 'bg-luxury-card hover:bg-luxury-card2'
                }
              `}
            >
              {/* Highlight ribbon */}
              {isSelected && (
                <div
                  className="absolute top-0 left-0 w-1.5 h-full"
                  style={{ backgroundColor: strat.accentColor }}
                />
              )}

              <div className="flex items-start justify-between">
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-white">
                      {strat.name}
                    </span>
                    <span
                      style={{ color: strat.accentColor, borderColor: `${strat.accentColor}55`, backgroundColor: `${strat.accentColor}15` }}
                      className="text-[10px] px-2 py-0.5 rounded-full font-bold border"
                    >
                      {strat.badge}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {strat.description}
                  </p>

                  <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] text-gray-400">
                    <span className="bg-black/40 px-2 py-0.5 rounded border border-white/5">
                      수식: {strat.algorithmSummary}
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  {isSelected ? (
                    <CheckCircle2
                      className="w-5 h-5"
                      style={{ color: strat.accentColor }}
                    />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advanced Custom Filter Control Card */}
      <div className="p-4 rounded-2xl gold-glass border border-luxury-gold/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-luxury-gold" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              사용자 맞춤 조건 (고정수 & 제외수)
            </span>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenFilterModal();
            }}
            className="text-xs text-luxury-gold font-bold hover:underline flex items-center gap-1"
          >
            설정 변경
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-300">
              <Lock className="w-3.5 h-3.5 text-luxury-gold" />
              <span>고정수:</span>
            </div>
            <span className="font-bold text-luxury-gold">
              {fixedNumbers.length > 0 ? fixedNumbers.join(', ') : '없음'}
            </span>
          </div>

          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-300">
              <Ban className="w-3.5 h-3.5 text-red-400" />
              <span>제외수:</span>
            </div>
            <span className="font-bold text-red-400">
              {excludedNumbers.length > 0 ? `${excludedNumbers.length}개 제외` : '없음'}
            </span>
          </div>
        </div>
      </div>

      {/* Game Set Count Selector */}
      <div className="p-4 rounded-2xl gold-glass border border-luxury-gold/30 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-white block">생성 세트 수</span>
          <span className="text-[11px] text-gray-400">한 번에 추천받을 게임 수 (1~5게임)</span>
        </div>

        <div className="flex items-center gap-1.5">
          {[1, 3, 5].map((cnt) => (
            <button
              key={cnt}
              onClick={() => {
                soundEngine.playClick();
                onChangeGameCount(cnt);
              }}
              className={`w-9 h-9 rounded-xl font-bold text-xs transition ${
                gameCount === cnt
                  ? 'bg-luxury-gold text-luxury-black shadow-gold-sm font-black'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              {cnt}
            </button>
          ))}
        </div>
      </div>

      {/* Launch Button */}
      <button
        onClick={() => {
          soundEngine.playClick();
          onGenerateAndGoDraw();
        }}
        className="w-full py-3.5 rounded-2xl gold-glow-button text-luxury-black font-black text-sm flex items-center justify-center gap-2 shadow-gold-lg"
      >
        <Brain className="w-4 h-4" />
        <span>선택한 AI 전략으로 로또 번호 추첨하기</span>
      </button>
    </div>
  );
};

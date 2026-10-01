import React, { useState } from 'react';
import { X, Play, Sparkles, TrendingUp, DollarSign, Award } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { BacktestEngine } from '../services/backtestEngine';
import type { BacktestResult } from '../services/backtestEngine';
import { STRATEGIES } from '../services/aiEngine';
import type { AIStrategyId } from '../services/aiEngine';
import { formatKRW } from '../data/lottoData';

interface BacktestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStrategy: AIStrategyId;
}

export const BacktestModal: React.FC<BacktestModalProps> = ({
  isOpen,
  onClose,
  defaultStrategy,
}) => {
  const [strategy, setStrategy] = useState<AIStrategyId>(defaultStrategy);
  const [rounds, setRounds] = useState<number>(20);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<BacktestResult | null>(null);

  if (!isOpen) return null;

  const handleRunSimulation = () => {
    soundEngine.playSpin(1.5);
    setIsRunning(true);

    setTimeout(() => {
      const res = BacktestEngine.runBacktest(strategy, rounds, 5);
      const stratObj = STRATEGIES.find(s => s.id === strategy);
      res.strategyName = stratObj ? stratObj.name : strategy;
      setResult(res);
      setIsRunning(false);
      soundEngine.playJackpot();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#181928] to-[#0A0B10] border border-luxury-gold/40 rounded-2xl shadow-2xl p-5 text-gray-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-luxury-gold/15 text-luxury-gold text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              100만원 가치 검증 시뮬레이터
            </div>
            <h3 className="text-lg font-bold text-gold-gradient">
              AI 과거 회차 백테스팅 엔진
            </h3>
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

        {/* Controls */}
        <div className="my-4 space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">
              검증할 AI 전략 모델
            </label>
            <select
              value={strategy}
              onChange={(e) => {
                soundEngine.playClick();
                setStrategy(e.target.value as AIStrategyId);
              }}
              className="w-full bg-[#12131C] border border-luxury-gold/30 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-luxury-gold"
            >
              {STRATEGIES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.badge})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">
              과거 테스트 회차 범위
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 15, 20].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    soundEngine.playClick();
                    setRounds(r);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    rounds === r
                      ? 'bg-luxury-gold text-luxury-black font-black'
                      : 'bg-white/5 text-gray-400 border border-white/10'
                  }`}
                >
                  최근 {r}회차 ({r * 5}게임)
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isRunning}
            className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
              isRunning
                ? 'bg-gray-800 text-gray-400 animate-pulse cursor-not-allowed'
                : 'gold-glow-button text-luxury-black shadow-gold-sm hover:brightness-110'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isRunning ? '역대 회차 대조 시뮬레이션 연산 중...' : '백테스팅 시뮬레이션 가동'}</span>
          </button>
        </div>

        {/* Results View */}
        {result && (
          <div className="space-y-3 pt-2 animate-fade-in">
            {/* Top Score Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#201D13] to-[#141520] border border-luxury-gold/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-luxury-gold font-bold block">
                  AI 적중 효율 지수
                </span>
                <span className="text-xl font-black text-yellow-300">
                  일반 랜덤 대비 {result.efficiencyVsRandom}배 우수
                </span>
              </div>
              <div className="w-11 h-11 rounded-full bg-luxury-gold/20 flex items-center justify-center border border-luxury-gold/50">
                <TrendingUp className="w-6 h-6 text-luxury-gold" />
              </div>
            </div>

            {/* Financial ROI Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-black/50 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                  <DollarSign className="w-3.5 h-3.5 text-luxury-gold" />
                  <span>누적 모의 투자금</span>
                </div>
                <div className="font-bold text-gray-200 mt-1">
                  {formatKRW(result.totalCost)} ({result.totalGames}게임)
                </div>
              </div>

              <div className="bg-black/50 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Award className="w-3.5 h-3.5 text-yellow-400" />
                  <span>누적 모의 당첨금</span>
                </div>
                <div className="font-bold text-yellow-400 mt-1">
                  {formatKRW(result.totalPrize)}
                </div>
              </div>
            </div>

            {/* Detailed Hit Distribution */}
            <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1.5 text-xs">
              <div className="text-[11px] font-bold text-gray-300 mb-1">
                실제 당첨 등수별 적중 결과
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span>1등 (6개 일치)</span>
                <span className="font-bold text-yellow-400">{result.hits.first}회</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span>2등 (5개+보너스)</span>
                <span className="font-bold text-amber-300">{result.hits.second}회</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span>3등 (5개 일치)</span>
                <span className="font-bold text-luxury-gold">{result.hits.third}회</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span>4등 (4개 일치 - 5만원)</span>
                <span className="font-bold text-blue-400">{result.hits.fourth}회</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span>5등 (3개 일치 - 5천원)</span>
                <span className="font-bold text-green-400">{result.hits.fifth}회</span>
              </div>
              <div className="pt-1 border-t border-white/10 flex items-center justify-between font-bold">
                <span className="text-gray-400">전체 당첨 적중률</span>
                <span className="text-yellow-400">{result.winRate}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

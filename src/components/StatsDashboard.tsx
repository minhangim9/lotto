import React, { useState } from 'react';
import { NUMBER_FREQUENCIES, HISTORICAL_DRAWS, formatKRW, getBallColorHex } from '../data/lottoData';
import { LottoBall } from './LottoBall';
import { Flame, Snowflake, BarChart3, History, Award } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const StatsDashboard: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'FREQUENCY' | 'RECENT'>('FREQUENCY');

  // Compute sorted frequencies
  const sortedFrequencies = Object.entries(NUMBER_FREQUENCIES)
    .map(([num, count]) => ({ num: parseInt(num, 10), count }))
    .sort((a, b) => b.count - a.count);

  const hot5 = sortedFrequencies.slice(0, 5);
  const cold5 = [...sortedFrequencies].reverse().slice(0, 5);

  const maxCount = Math.max(...sortedFrequencies.map(s => s.count));

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-gold/15 border border-luxury-gold/30 text-luxury-gold text-xs font-semibold mb-2">
          <Award className="w-3.5 h-3.5" />
          1,150회 빅데이터 AI 통계 분석실
        </div>
        <h2 className="text-xl font-black text-gold-gradient">
          동행복권 역대 누적 통계
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          1회부터 1,150회까지의 당첨 출현율과 패턴을 시각화 분석합니다.
        </p>
      </div>

      {/* Hot 5 & Cold 5 Quick Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Hot 5 */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-red-950/40 to-black/60 border border-red-500/30 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold mb-2">
            <Flame className="w-4 h-4 fill-red-400 text-red-500 animate-pulse" />
            <span>역대 최다 출현 HOT 5</span>
          </div>
          <div className="flex items-center justify-between gap-1">
            {hot5.map(({ num, count }) => (
              <div key={num} className="text-center">
                <LottoBall number={num} size="sm" />
                <span className="text-[10px] text-gray-400 block mt-1">{count}회</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cold 5 */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-950/40 to-black/60 border border-blue-500/30 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold mb-2">
            <Snowflake className="w-4 h-4 text-blue-400 animate-spin-slow" />
            <span>역대 최소 출현 COLD 5</span>
          </div>
          <div className="flex items-center justify-between gap-1">
            {cold5.map(({ num, count }) => (
              <div key={num} className="text-center">
                <LottoBall number={num} size="sm" />
                <span className="text-[10px] text-gray-400 block mt-1">{count}회</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Statistical Laws Card */}
      <div className="p-4 rounded-2xl gold-glass border border-luxury-gold/25 space-y-3">
        <h3 className="text-xs font-bold text-luxury-gold flex items-center gap-1.5 uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-luxury-gold"></span>
          1등 당첨 번호의 3대 수학적 황금 법칙
        </h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
            <div className="text-[10px] text-gray-400">총합 황금 구간</div>
            <div className="text-sm font-black text-yellow-300 mt-0.5">120 ~ 160</div>
            <div className="text-[9px] text-gray-400 mt-0.5">전체 당첨의 73.4%</div>
          </div>
          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
            <div className="text-[10px] text-gray-400">홀수:짝수 비율</div>
            <div className="text-sm font-black text-yellow-300 mt-0.5">3 : 3 (최다)</div>
            <div className="text-[9px] text-gray-400 mt-0.5">균형비 82.1%</div>
          </div>
          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
            <div className="text-[10px] text-gray-400">AC 복잡도 지수</div>
            <div className="text-sm font-black text-yellow-300 mt-0.5">AC ≥ 7</div>
            <div className="text-[9px] text-gray-400 mt-0.5">1등 조합 91.5%</div>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveSubTab('FREQUENCY');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'FREQUENCY'
              ? 'bg-luxury-gold text-luxury-black shadow-gold-sm'
              : 'bg-white/5 text-gray-400 border border-white/10'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>1~45번 전체 빈도 차트</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setActiveSubTab('RECENT');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeSubTab === 'RECENT'
              ? 'bg-luxury-gold text-luxury-black shadow-gold-sm'
              : 'bg-white/5 text-gray-400 border border-white/10'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>최근 20회차 당첨 히스토리</span>
        </button>
      </div>

      {/* Tab 1: 1~45 Bar Chart */}
      {activeSubTab === 'FREQUENCY' && (
        <div className="p-4 rounded-2xl gold-glass border border-luxury-gold/20 max-h-[360px] overflow-y-auto space-y-2">
          {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
            const count = NUMBER_FREQUENCIES[num] || 160;
            const pct = Math.round((count / maxCount) * 100);
            const colorHex = getBallColorHex(num);

            return (
              <div key={num} className="flex items-center gap-2.5 text-xs">
                <div className="w-8 shrink-0 text-right font-mono font-bold text-gray-300">
                  {num}번
                </div>
                <div className="flex-1 bg-black/50 h-5 rounded-full overflow-hidden p-0.5 border border-white/5 flex items-center">
                  <div
                    style={{
                      width: `${pct}%`,
                      backgroundColor: colorHex
                    }}
                    className="h-full rounded-full transition-all duration-500 shadow-sm flex items-center justify-end pr-1.5"
                  >
                    <span className="text-[10px] font-bold text-white drop-shadow">
                      {count}
                    </span>
                  </div>
                </div>
                <div className="w-10 text-right text-[10px] text-gray-400 font-mono">
                  {pct}%
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Recent 20 Draws Table */}
      {activeSubTab === 'RECENT' && (
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {HISTORICAL_DRAWS.map((draw) => (
            <div
              key={draw.round}
              className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-2 hover:border-luxury-gold/40 transition"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-luxury-gold">
                    제 {draw.round}회
                  </span>
                  <span className="text-gray-400 text-[11px]">{draw.date}</span>
                </div>
                <div className="text-[11px] text-gray-300">
                  1등 1인당 <span className="text-yellow-400 font-bold">{formatKRW(draw.firstPrize)}</span> ({draw.firstWinners}명)
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {draw.numbers.map((n) => (
                  <LottoBall key={n} number={n} size="sm" />
                ))}
                <span className="text-luxury-gold font-bold px-0.5">+</span>
                <LottoBall number={draw.bonus} size="sm" isBonus />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

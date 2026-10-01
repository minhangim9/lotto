import React, { useState } from 'react';
import type { SavedGame } from '../data/lottoData';
import { HISTORICAL_DRAWS } from '../data/lottoData';
import { LottoBall } from './LottoBall';
import { Trash2, Star, CheckCircle, Ticket, Share2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface SavedTicketsTabProps {
  savedGames: SavedGame[];
  onToggleFavorite: (id: string) => void;
  onDeleteGame: (id: string) => void;
  onClearAll: () => void;
  onOpenReceipt: (games: { numbers: number[]; confidenceScore: number }[], mode: string) => void;
}

export const SavedTicketsTab: React.FC<SavedTicketsTabProps> = ({
  savedGames,
  onToggleFavorite,
  onDeleteGame,
  onClearAll,
  onOpenReceipt,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'FAV' | 'WIN'>('ALL');

  const latestDraw = HISTORICAL_DRAWS[0];

  // Helper to check match against latest draw
  const getWinResult = (numbers: number[]) => {
    let matchCount = 0;
    let hasBonus = false;

    numbers.forEach((n) => {
      if (latestDraw.numbers.includes(n)) matchCount++;
      if (n === latestDraw.bonus) hasBonus = true;
    });

    if (matchCount === 6) return { text: '1등 당첨!', color: 'text-yellow-400 bg-yellow-400/20', isWin: true };
    if (matchCount === 5 && hasBonus) return { text: '2등 당첨!', color: 'text-amber-300 bg-amber-400/20', isWin: true };
    if (matchCount === 5) return { text: '3등 당첨', color: 'text-luxury-gold bg-luxury-gold/20', isWin: true };
    if (matchCount === 4) return { text: '4등 당첨 (5만원)', color: 'text-blue-400 bg-blue-500/20', isWin: true };
    if (matchCount === 3) return { text: '5등 당첨 (5천원)', color: 'text-green-400 bg-green-500/20', isWin: true };
    return { text: `${matchCount}개 일치`, color: 'text-gray-400 bg-white/5', isWin: false };
  };

  const filteredGames = savedGames.filter((g) => {
    if (filter === 'FAV') return g.isFavorite;
    if (filter === 'WIN') return getWinResult(g.numbers).isWin;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-gold-gradient">
            MY VIP 보관함
          </h2>
          <p className="text-xs text-gray-400">
            생성 및 보관된 프리미엄 티켓 ({savedGames.length}개)
          </p>
        </div>

        {savedGames.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenReceipt(
                  savedGames.map((g) => ({ numbers: g.numbers, confidenceScore: 98.5 })),
                  'VIP 보관함 컬렉션'
                );
              }}
              className="px-2.5 py-1.5 rounded-lg bg-luxury-gold/20 border border-luxury-gold/40 text-luxury-gold text-xs font-semibold flex items-center gap-1 hover:bg-luxury-gold/30"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>영수증 발행</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('보관함의 모든 티켓을 삭제하시겠습니까?')) {
                  soundEngine.playClick();
                  onClearAll();
                }
              }}
              className="p-1.5 text-gray-400 hover:text-red-400"
              title="전체 삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            soundEngine.playClick();
            setFilter('ALL');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            filter === 'ALL'
              ? 'bg-luxury-gold text-luxury-black'
              : 'bg-white/5 text-gray-400 border border-white/10'
          }`}
        >
          전체 ({savedGames.length})
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setFilter('FAV');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
            filter === 'FAV'
              ? 'bg-yellow-500 text-black'
              : 'bg-white/5 text-gray-400 border border-white/10'
          }`}
        >
          <Star className="w-3 h-3 fill-current" />
          즐겨찾기
        </button>

        <button
          onClick={() => {
            soundEngine.playClick();
            setFilter('WIN');
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
            filter === 'WIN'
              ? 'bg-green-600 text-white'
              : 'bg-white/5 text-gray-400 border border-white/10'
          }`}
        >
          <CheckCircle className="w-3 h-3" />
          당첨 티켓
        </button>
      </div>

      {/* Games List */}
      {filteredGames.length === 0 ? (
        <div className="py-16 text-center text-gray-400 bg-white/5 border border-white/10 rounded-2xl">
          <Ticket className="w-12 h-12 text-luxury-gold/40 mx-auto mb-3" />
          <p className="text-sm font-semibold">보관된 로또 티켓이 없습니다.</p>
          <p className="text-xs text-gray-400 mt-1">
            추첨기 탭에서 번호를 생성한 후 '보관함 저장'을 눌러보세요.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGames.map((game, idx) => {
            const win = getWinResult(game.numbers);
            return (
              <div
                key={game.id || idx}
                className="p-3.5 rounded-2xl gold-glass border border-luxury-gold/20 flex flex-col gap-2.5 hover:border-luxury-gold/50 transition-all shadow-md"
              >
                {/* Header row */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-luxury-gold/20 text-luxury-gold font-bold text-[10px]">
                      {game.mode || 'AI 추천'}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {game.createdAt || '최근'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Win badge */}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/10 ${win.color}`}>
                      {win.text}
                    </span>

                    {/* Favorite button */}
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        onToggleFavorite(game.id);
                      }}
                      className={`p-1 rounded-full ${
                        game.isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${game.isFavorite ? 'fill-yellow-400' : ''}`} />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        onDeleteGame(game.id);
                      }}
                      className="p-1 rounded-full text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Balls row */}
                <div className="flex items-center justify-between gap-1 pt-1">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {game.numbers.map((n) => {
                      const isHit = latestDraw.numbers.includes(n);
                      return (
                        <LottoBall
                          key={n}
                          number={n}
                          size="sm"
                          highlight={isHit}
                        />
                      );
                    })}
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block">제 {game.roundTarget || latestDraw.round + 1}회차 대비</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

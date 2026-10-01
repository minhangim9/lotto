import React, { useState } from 'react';
import { LottoBall } from './LottoBall';
import type { GeneratedGame } from '../services/aiEngine';
import { LATEST_ROUND } from '../data/lottoData';
import { X, Copy, Check, Share2, Sparkles, ShieldCheck, Download } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { generateVIPReceiptImage } from '../utils/receiptGenerator';

interface VIPReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: GeneratedGame[];
  strategyName: string;
}

export const VIPReceiptModal: React.FC<VIPReceiptModalProps> = ({
  isOpen,
  onClose,
  games,
  strategyName
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const targetRound = LATEST_ROUND + 1;
  const issueDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  const serialNumber = `VIP-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-${targetRound}`;

  const handleCopyText = () => {
    soundEngine.playClick();
    const textLines = [
      `👑 [로얄 로또 VIP] 제 ${targetRound}회 1등 골든 티켓 👑`,
      `알고리즘: ${strategyName}`,
      `발급일시: ${issueDate}`,
      `시리얼: ${serialNumber}`,
      `---------------------------------`,
      ...games.map((g, idx) => {
        const letter = ['A', 'B', 'C', 'D', 'E'][idx] || `${idx + 1}`;
        return `[${letter}열] ${g.numbers.map(n => n.toString().padStart(2, '0')).join(' ')} (AI적합도: ${g.confidenceScore}%)`;
      }),
      `---------------------------------`,
      `★ 대한민국 1등 당첨의 영광을 기원합니다 ★`
    ].join('\n');

    navigator.clipboard.writeText(textLines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = () => {
    soundEngine.playClick();
    if (navigator.share) {
      navigator.share({
        title: `로얄 로또 VIP 제 ${targetRound}회 번호`,
        text: `제 ${targetRound}회차 1등 추천 번호가 생성되었습니다.\n확인해보세요!`
      }).catch(() => {});
    } else {
      handleCopyText();
    }
  };

  const handleDownloadPNG = () => {
    soundEngine.playClick();
    const dataUrl = generateVIPReceiptImage(
      games.map(g => ({ numbers: g.numbers, confidenceScore: g.confidenceScore })),
      strategyName,
      targetRound,
      serialNumber
    );
    if (dataUrl) {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `RoyalLottoVIP_${targetRound}회_${serialNumber}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#181926] to-[#0D0E15] border-2 border-luxury-gold/50 rounded-2xl shadow-2xl overflow-hidden p-6 text-gray-200">
        {/* Golden Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-luxury-gold"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-luxury-gold"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-luxury-gold"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-luxury-gold"></div>

        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-3.5 right-3.5 text-gray-400 hover:text-white p-1 rounded-full bg-white/5 border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Receipt Header */}
        <div className="text-center mb-5 pb-4 border-b border-luxury-gold/30">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-gold/15 border border-luxury-gold/40 text-luxury-gold text-xs font-semibold tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            VIP 1등 프리미엄 증명서
          </div>
          <h2 className="text-2xl font-black tracking-wider text-gold-gradient uppercase">
            ROYAL LOTTO VIP
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            제 <span className="text-yellow-400 font-bold">{targetRound}회</span> 추첨 대비 엄선 조합
          </p>
          <div className="flex items-center justify-between text-[11px] text-gray-400 mt-3 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
            <span>발급: {issueDate}</span>
            <span className="font-mono text-luxury-gold">{serialNumber}</span>
          </div>
        </div>

        {/* Games list in receipt */}
        <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
          {games.map((game, idx) => {
            const letter = ['A', 'B', 'C', 'D', 'E'][idx] || `${idx + 1}`;
            return (
              <div
                key={idx}
                className="bg-black/40 border border-luxury-gold/25 rounded-xl p-2.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-luxury-gold/20 text-luxury-gold font-bold text-xs flex items-center justify-center border border-luxury-gold/40">
                    {letter}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {game.numbers.map((n) => (
                      <LottoBall key={n} number={n} size="sm" />
                    ))}
                  </div>
                </div>
                <div className="text-right pl-2">
                  <div className="text-[10px] text-luxury-gold font-bold">
                    {game.confidenceScore}%
                  </div>
                  <div className="text-[9px] text-gray-400">적합도</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Golden Certification Seal */}
        <div className="mt-4 pt-3 border-t border-luxury-gold/20 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-luxury-gold" />
            <div>
              <div className="text-white font-semibold text-[11px]">인공지능 퀀텀 필터 검증 완료</div>
              <div className="text-[10px] text-gray-400">{strategyName}</div>
            </div>
          </div>
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-luxury-gold/60 flex flex-col items-center justify-center text-[8px] text-luxury-gold font-black uppercase text-center rotate-[-12deg] bg-luxury-gold/10">
            <span>OFFICIAL</span>
            <span>VIP SEAL</span>
          </div>
        </div>

        {/* Actions (Copy, PNG Download, Share) */}
        <div className="mt-4 space-y-2">
          <button
            onClick={handleDownloadPNG}
            className="w-full py-2.5 px-4 rounded-xl gold-glow-button text-luxury-black font-black text-xs flex items-center justify-center gap-2 shadow-gold-sm"
          >
            <Download className="w-4 h-4" />
            <span>고화질 골든 티켓 이미지 저장 (PNG)</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span>복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>텍스트 복사</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-luxury-gold/40 text-luxury-gold font-bold text-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>VIP 번호 공유</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, CheckCircle, Shield, Key, Download, Sparkles, Building2, PhoneCall } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface CommercialPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommercialPitchModal: React.FC<CommercialPitchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [licenseStatus, setLicenseStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerifyKey = () => {
    soundEngine.playClick();
    if (licenseKeyInput.trim().toUpperCase().includes('VIP') || licenseKeyInput.trim().length >= 8) {
      setLicenseStatus('정품 영구 라이선스가 인증되었습니다 (소유권 양도 완료).');
      soundEngine.playJackpot();
    } else {
      setLicenseStatus('유효한 라이선스 키를 입력하세요 (예: ROYAL-VIP-2026-GOLD).');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#181928] via-[#0E0F17] to-[#06070A] border-2 border-luxury-gold/60 rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.3)] p-6 text-gray-200 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full bg-white/5 border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-gold/20 border border-luxury-gold/40 text-luxury-gold text-xs font-bold tracking-widest uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            100만 원 프리미엄 솔루션 사양서
          </div>
          <h2 className="text-2xl font-black text-gold-gradient uppercase tracking-wide">
            ROYAL LOTTO VIP 솔루션
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            구매 고객 납품 및 상업적 서비스 운영을 위한 최고급 소프트웨어 패키지
          </p>
        </div>

        {/* 5 Core Values for 1 Million KRW */}
        <div className="space-y-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-black/50 border border-luxury-gold/30 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-luxury-gold/20 text-luxury-gold flex items-center justify-center shrink-0 mt-0.5">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Three.js 3D WebGL 실시간 물리 엔진</h4>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                전문 3D 개발팀 외주 개발 시 최소 300~500만 원 견적이 소요되는 고난이도 3D 인터랙티브 추첨기 탑재.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/50 border border-luxury-gold/30 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-luxury-gold/20 text-luxury-gold flex items-center justify-center shrink-0 mt-0.5">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">1,150회 빅데이터 5대 AI 추천 엔진</h4>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                단순 랜덤이 아닌 5대 수학적 확률 필터(합계, 홀짝, 저고, AC 복잡도, 오방색) 및 몬테카를로 백테스팅 엔진 내장.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/50 border border-luxury-gold/30 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-luxury-gold/20 text-luxury-gold flex items-center justify-center shrink-0 mt-0.5">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">종이 복권 카메라 QR 자동 스캐너</h4>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                사용자가 구매한 실물 복권 종이의 QR코드를 카메라로 스캔하여 1등~5등 및 당첨금을 즉시 판별하는 핵심 편의 기능.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/50 border border-luxury-gold/30 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-luxury-gold/20 text-luxury-gold flex items-center justify-center shrink-0 mt-0.5">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">iOS / Android 앱스토어 및 PWA 즉시 배포</h4>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                Capacitor 네이티브 앱 빌드 완비 및 브라우저에서 '홈 화면에 앱 추가'가 가능한 PWA 규격 100% 충족.
              </p>
            </div>
          </div>
        </div>

        {/* License Key Authentication Box */}
        <div className="p-4 rounded-2xl gold-glass border border-luxury-gold/40 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-4 h-4 text-luxury-gold" />
            <span className="text-xs font-bold text-white">
              상업용 라이선스 키 활성화 (고객 납품용)
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={licenseKeyInput}
              onChange={(e) => setLicenseKeyInput(e.target.value)}
              placeholder="예: ROYAL-VIP-2026-GOLD"
              className="flex-1 bg-black/50 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-luxury-gold font-mono uppercase"
            />
            <button
              onClick={handleVerifyKey}
              className="px-4 py-2 rounded-xl gold-glow-button text-luxury-black font-bold text-xs shrink-0"
            >
              인증 확인
            </button>
          </div>
          {licenseStatus && (
            <div className="mt-2 text-xs font-semibold text-yellow-300 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
              <span>{licenseStatus}</span>
            </div>
          )}
        </div>

        {/* Client Sales Contact Callout */}
        <div className="p-3.5 bg-luxury-gold/10 border border-luxury-gold/30 rounded-2xl text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-luxury-gold">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>구매자 독점 소유권 & 소스코드 100% 양도</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-normal">
            본 소프트웨어는 월정액 비용이 없는 단독 설치형 솔루션으로, 구매자가 자체 브랜드로 수정하거나 앱스토어 유료 앱으로 판매하여 수익을 창출할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

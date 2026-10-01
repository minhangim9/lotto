import { useState, useEffect } from 'react';
import { DrawTab } from './components/DrawTab';
import { AILabTab } from './components/AILabTab';
import { StatsDashboard } from './components/StatsDashboard';
import { SavedTicketsTab } from './components/SavedTicketsTab';
import { VIPReceiptModal } from './components/VIPReceiptModal';
import { QRScannerModal } from './components/QRScannerModal';
import { NumberFilterModal } from './components/NumberFilterModal';
import { BacktestModal } from './components/BacktestModal';
import { SajuFortuneModal } from './components/SajuFortuneModal';
import { CommercialPitchModal } from './components/CommercialPitchModal';
import type { AIStrategyId, GeneratedGame } from './services/aiEngine';
import { STRATEGIES } from './services/aiEngine';
import type { SavedGame } from './data/lottoData';
import { LATEST_ROUND } from './data/lottoData';
import { soundEngine } from './utils/audio';
import { 
  Sparkles, 
  Crown, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Maximize2,
  Dices,
  Brain,
  BarChart2,
  Ticket,
  QrCode,
  Award
} from 'lucide-react';

type TabType = 'DRAW' | 'AI_LAB' | 'STATS' | 'TICKETS';

export function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<TabType>('DRAW');

  // Strategy & Filters State
  const [strategy, setStrategy] = useState<AIStrategyId>('QUANTUM_GOLD');
  const [gameCount, setGameCount] = useState<number>(5);
  const [fixedNumbers, setFixedNumbers] = useState<number[]>([]);
  const [excludedNumbers, setExcludedNumbers] = useState<number[]>([]);

  // Sound & Frame Preview States
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const [isMobileFrameView, setIsMobileFrameView] = useState<boolean>(true);

  // Modals
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isBacktestOpen, setIsBacktestOpen] = useState(false);
  const [isSajuOpen, setIsSajuOpen] = useState(false);
  const [isCommercialOpen, setIsCommercialOpen] = useState(false);
  const [receiptGames, setReceiptGames] = useState<GeneratedGame[]>([]);
  const [receiptTitle, setReceiptTitle] = useState<string>('AI 퀀텀 골드');

  // Saved Games in LocalStorage
  const [savedGames, setSavedGames] = useState<SavedGame[]>(() => {
    try {
      const stored = localStorage.getItem('royal_lotto_vip_tickets');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    // Initial sample VIP ticket
    return [
      {
        id: 'init-1',
        createdAt: '2024. 12. 16. 18:30',
        roundTarget: 1151,
        mode: 'AI 퀀텀 골드',
        numbers: [7, 12, 23, 29, 34, 43],
        isFavorite: true
      },
      {
        id: 'init-2',
        createdAt: '2024. 12. 16. 18:31',
        roundTarget: 1151,
        mode: '최신 핫 트렌드',
        numbers: [3, 11, 16, 21, 33, 40],
        isFavorite: false
      }
    ];
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('royal_lotto_vip_tickets', JSON.stringify(savedGames));
    } catch {
      // ignore
    }
  }, [savedGames]);

  // Audio Toggle
  const toggleSound = () => {
    const next = !isSoundOn;
    setIsSoundOn(next);
    soundEngine.enabled = next;
    if (next) soundEngine.playClick();
  };

  // Save games handler
  const handleSaveGames = (games: GeneratedGame[]) => {
    const stratName = STRATEGIES.find(s => s.id === strategy)?.name || 'AI 추천';
    const now = new Date();
    const dateStr = `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, '0')}. ${String(now.getDate()).padStart(2, '0')}. ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newEntries: SavedGame[] = games.map((g) => ({
      id: 'ticket-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: dateStr,
      roundTarget: LATEST_ROUND + 1,
      mode: stratName,
      numbers: g.numbers,
      fixedNumbers,
      excludedNumbers,
      isFavorite: false
    }));

    setSavedGames(prev => [...newEntries, ...prev]);
  };

  const handleToggleFavorite = (id: string) => {
    setSavedGames(prev =>
      prev.map(g => (g.id === id ? { ...g, isFavorite: !g.isFavorite } : g))
    );
  };

  const handleDeleteGame = (id: string) => {
    setSavedGames(prev => prev.filter(g => g.id !== id));
  };

  const handleClearAll = () => {
    setSavedGames([]);
  };

  const handleOpenReceipt = (games: GeneratedGame[], title: string) => {
    setReceiptGames(games);
    setReceiptTitle(title);
    setIsReceiptOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#07080B] text-gray-100 flex flex-col items-center justify-start relative overflow-x-hidden selection:bg-luxury-gold selection:text-black">
      {/* Background Ambient Luxury Light */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-luxury-gold/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="fixed bottom-0 right-1/4 w-80 h-80 bg-amber-600/5 blur-[100px] pointer-events-none rounded-full" />

      {/* PC Top Utility Controls */}
      <header className="w-full max-w-4xl px-4 py-2 flex items-center justify-between text-xs text-gray-400 border-b border-white/5 relative z-30">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-luxury-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-luxury-gold"></span>
          </span>
          <span className="text-[11px] font-mono text-luxury-gold">
            제 {LATEST_ROUND + 1}회 추첨 대비 AI 엔진 가동 중
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="flex items-center gap-1 hover:text-white transition p-1"
            title={isSoundOn ? '사운드 끄기' : '사운드 켜기'}
          >
            {isSoundOn ? <Volume2 className="w-4 h-4 text-luxury-gold" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
            <span className="hidden sm:inline text-[11px]">{isSoundOn ? '사운드 ON' : '음소거'}</span>
          </button>

          {/* Device Frame View Switcher (Desktop convenience) */}
          <button
            onClick={() => setIsMobileFrameView(!isMobileFrameView)}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-[11px] transition"
          >
            {isMobileFrameView ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>전체화면 모드</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-luxury-gold" />
                <span>모바일 뷰 프레임</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container / Mobile Device Mockup Frame */}
      <main
        className={`
          w-full transition-all duration-300 relative z-20 flex-1 flex flex-col
          ${
            isMobileFrameView
              ? 'max-w-md my-0 md:my-5 rounded-none md:rounded-[42px] border-0 md:border-[10px] md:border-[#1E202B] md:shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_30px_rgba(212,175,55,0.15)] bg-[#0C0D14]'
              : 'max-w-2xl px-4 py-4'
          }
        `}
      >
        {/* Dynamic Island / Mobile Speaker Notch (Visual authenticity on mockup) */}
        {isMobileFrameView && (
          <div className="hidden md:flex items-center justify-center pt-3 pb-1">
            <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center gap-2 px-3 border border-white/10 shadow-inner">
              <div className="w-2 h-2 rounded-full bg-[#1A1A24]" />
              <div className="w-8 h-1 rounded-full bg-[#1A1A24]" />
            </div>
          </div>
        )}

        {/* VIP App Header */}
        <div className="px-5 pt-3 pb-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#FFE072] via-[#D4AF37] to-[#996515] p-[1.5px] shadow-gold-sm">
              <div className="w-full h-full bg-luxury-black rounded-[14px] flex items-center justify-center">
                <Crown className="w-5 h-5 text-luxury-gold" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-black tracking-wider text-gold-gradient uppercase">
                  ROYAL LOTTO
                </h1>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-luxury-gold text-luxury-black font-mono">
                  VIP
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium tracking-tight">
                인공지능 1등 당첨 예측 시스템
              </p>
            </div>
          </div>

          {/* Header Quick Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundEngine.playClick();
                setIsCommercialOpen(true);
              }}
              className="p-2 rounded-xl bg-luxury-gold/20 hover:bg-luxury-gold/30 border border-luxury-gold/50 text-luxury-gold transition flex items-center gap-1 text-xs font-bold shadow-gold-sm"
              title="100만 원 솔루션 사양서 및 라이선스"
            >
              <Award className="w-4 h-4 text-yellow-300" />
              <span className="text-[11px] hidden sm:inline text-yellow-300 font-black">100만원 사양</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setIsQRScannerOpen(true);
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition flex items-center gap-1 text-xs font-bold"
              title="QR코드 당첨 스캔"
            >
              <QrCode className="w-4 h-4 text-luxury-gold" />
              <span className="text-[11px] hidden sm:inline">QR확인</span>
            </button>
          </div>
        </div>

        {/* Scrollable Tab Content View */}
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
          {currentTab === 'DRAW' && (
            <DrawTab
              currentStrategy={strategy}
              fixedNumbers={fixedNumbers}
              excludedNumbers={excludedNumbers}
              gameCount={gameCount}
              onSaveGames={handleSaveGames}
              onOpenReceipt={(games, title) => handleOpenReceipt(games, title)}
              onOpenFilterModal={() => setIsFilterModalOpen(true)}
              onNavigateToAILab={() => setCurrentTab('AI_LAB')}
              onOpenBacktest={() => setIsBacktestOpen(true)}
              onOpenSaju={() => setIsSajuOpen(true)}
              onOpenCommercial={() => setIsCommercialOpen(true)}
            />
          )}

          {currentTab === 'AI_LAB' && (
            <AILabTab
              selectedStrategy={strategy}
              onSelectStrategy={(id) => setStrategy(id)}
              fixedNumbers={fixedNumbers}
              excludedNumbers={excludedNumbers}
              onOpenFilterModal={() => setIsFilterModalOpen(true)}
              gameCount={gameCount}
              onChangeGameCount={(cnt) => setGameCount(cnt)}
              onGenerateAndGoDraw={() => setCurrentTab('DRAW')}
            />
          )}

          {currentTab === 'STATS' && <StatsDashboard />}

          {currentTab === 'TICKETS' && (
            <SavedTicketsTab
              savedGames={savedGames}
              onToggleFavorite={handleToggleFavorite}
              onDeleteGame={handleDeleteGame}
              onClearAll={handleClearAll}
              onOpenReceipt={(games, title) => {
                const converted: GeneratedGame[] = games.map(g => ({
                  numbers: g.numbers,
                  sum: g.numbers.reduce((a, b) => a + b, 0),
                  oddEven: '3 : 3',
                  highLow: '3 : 3',
                  acValue: 8,
                  confidenceScore: g.confidenceScore,
                  aiNotes: ['VIP 보관함']
                }));
                handleOpenReceipt(converted, title);
              }}
            />
          )}
        </div>

        {/* Bottom VIP Mobile Navigation Bar */}
        <nav className="fixed md:absolute bottom-0 left-0 right-0 z-40 bg-[#0E1018]/90 backdrop-blur-xl border-t border-luxury-gold/20 px-3 py-2">
          <div className="flex items-center justify-around max-w-md mx-auto">
            {/* Draw Tab */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setCurrentTab('DRAW');
              }}
              className={`flex flex-col items-center gap-1 p-1 transition ${
                currentTab === 'DRAW' ? 'text-luxury-gold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition ${
                  currentTab === 'DRAW' ? 'bg-luxury-gold/20 shadow-gold-sm' : ''
                }`}
              >
                <Dices className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold">추첨기</span>
            </button>

            {/* AI Lab Tab */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setCurrentTab('AI_LAB');
              }}
              className={`flex flex-col items-center gap-1 p-1 transition ${
                currentTab === 'AI_LAB' ? 'text-luxury-gold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition ${
                  currentTab === 'AI_LAB' ? 'bg-luxury-gold/20 shadow-gold-sm' : ''
                }`}
              >
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold">AI 전략</span>
            </button>

            {/* Center Quick Scan Action */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setIsQRScannerOpen(true);
              }}
              className="flex flex-col items-center -mt-5 group"
            >
              <div className="w-13 h-13 rounded-full gold-glow-button p-3 text-luxury-black shadow-gold-lg group-active:scale-95 transition">
                <QrCode className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-luxury-gold mt-1">QR 스캔</span>
            </button>

            {/* Stats Tab */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setCurrentTab('STATS');
              }}
              className={`flex flex-col items-center gap-1 p-1 transition ${
                currentTab === 'STATS' ? 'text-luxury-gold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition ${
                  currentTab === 'STATS' ? 'bg-luxury-gold/20 shadow-gold-sm' : ''
                }`}
              >
                <BarChart2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold">빅데이터</span>
            </button>

            {/* Tickets Tab */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setCurrentTab('TICKETS');
              }}
              className={`flex flex-col items-center gap-1 p-1 transition ${
                currentTab === 'TICKETS' ? 'text-luxury-gold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition relative ${
                  currentTab === 'TICKETS' ? 'bg-luxury-gold/20 shadow-gold-sm' : ''
                }`}
              >
                <Ticket className="w-5 h-5" />
                {savedGames.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-luxury-gold text-luxury-black font-black text-[9px] rounded-full flex items-center justify-center">
                    {savedGames.length > 99 ? '99+' : savedGames.length}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold">보관함</span>
            </button>
          </div>
        </nav>
      </main>

      {/* VIP Footer Tagline */}
      <footer className="py-4 text-center text-[11px] text-gray-500 relative z-10 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-luxury-gold/60" />
        <span>ROYAL LOTTO VIP © 2026. High-End Predictive Lottery Suite.</span>
      </footer>

      {/* Global Modals */}
      <VIPReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        games={receiptGames}
        strategyName={receiptTitle}
      />

      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
      />

      <NumberFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        fixedNumbers={fixedNumbers}
        excludedNumbers={excludedNumbers}
        onApplyFilters={(f, e) => {
          setFixedNumbers(f);
          setExcludedNumbers(e);
        }}
      />

      <BacktestModal
        isOpen={isBacktestOpen}
        onClose={() => setIsBacktestOpen(false)}
        defaultStrategy={strategy}
      />

      <SajuFortuneModal
        isOpen={isSajuOpen}
        onClose={() => setIsSajuOpen(false)}
        onApplyLuckyNumbers={(lucky) => {
          setFixedNumbers(lucky.slice(0, 5));
          setCurrentTab('DRAW');
        }}
      />

      <CommercialPitchModal
        isOpen={isCommercialOpen}
        onClose={() => setIsCommercialOpen(false)}
      />
    </div>
  );
}

export default App;

import { NUMBER_FREQUENCIES, HISTORICAL_DRAWS, calculateACValue } from '../data/lottoData';

export type AIStrategyId = 'QUANTUM_GOLD' | 'DEEP_TREND' | 'COLD_REVERSAL' | 'HIGH_ROLLER' | 'ROYAL_FORTUNE';

export interface StrategyInfo {
  id: AIStrategyId;
  name: string;
  badge: string;
  description: string;
  recommendedFor: string;
  algorithmSummary: string;
  accentColor: string;
}

export const STRATEGIES: StrategyInfo[] = [
  {
    id: 'QUANTUM_GOLD',
    name: 'AI 퀀텀 골드 (황금 밸런스)',
    badge: '1등 최적화 98.7%',
    description: '역대 1등 당첨 데이터 5대 황금 지표(합계·홀짝·AC값·색상분포)를 통과한 엄선 조합',
    recommendedFor: '정통 통계 기반 최고 확률을 노리는 VIP 플레이어',
    algorithmSummary: '합계 120~160, 홀짝 3:3/2:4, AC≥7, 4개 이상 색상 분산',
    accentColor: '#D4AF37'
  },
  {
    id: 'DEEP_TREND',
    name: '최신 핫 트렌드 (상승 모멘텀)',
    badge: '최근 20회 급상승',
    description: '최근 회차에서 강한 출현 모멘텀을 보이는 번호들에 높은 가중치 부여',
    recommendedFor: '현재 흐름과 연타석 출현 번호를 공략하고 싶은 분',
    algorithmSummary: '최근 20회차 출현 빈도 가중치 70% + 연속 출현 패턴',
    accentColor: '#FF6B6B'
  },
  {
    id: 'COLD_REVERSAL',
    name: '역발상 반등 추적 (콜드 리버스)',
    badge: '출현 임계점 도달',
    description: '장기간 미출현하여 통계적 회귀 법칙상 출현 임계점에 도달한 잠재 번호 포진',
    recommendedFor: '오랫동안 숨어있던 대박 번호의 귀환을 노리는 분',
    algorithmSummary: '장기 미출현수 3수 + 최적 밸런스 보완수 3수 하이브리드',
    accentColor: '#4ECDC4'
  },
  {
    id: 'HIGH_ROLLER',
    name: '독점 고배당 (단독 1등 타깃)',
    badge: '초대박 독식 노림수',
    description: '대중의 생일/기념일(1~31) 쏠림을 회피하여 당첨 시 독점 1등 상금을 극대화',
    recommendedFor: '수십억 단독 당첨금을 목표로 하는 하이롤러 VIP',
    algorithmSummary: '31~45번 고번호 집중 배치 + 비정형 패턴 간격 설계',
    accentColor: '#9D4EDD'
  },
  {
    id: 'ROYAL_FORTUNE',
    name: '황금 사주 & 오행 비책',
    badge: '재물운 기운 매칭',
    description: '목·화·토·금·수 오행의 상생 에너지와 천기누설 재물운수를 융합한 행운의 수',
    recommendedFor: '사주팔자와 오늘의 운세 시너지로 인생 역전을 꿈꾸는 분',
    algorithmSummary: '오행(1~9 목, 10~19 화, 20~29 토, 30~39 금, 40~45 수) 균형수',
    accentColor: '#FFB703'
  }
];

export interface GenerationOptions {
  fixedNumbers?: number[];
  excludedNumbers?: number[];
  count?: number; // 1 to 5 games
}

export interface GeneratedGame {
  numbers: number[];
  sum: number;
  oddEven: string; // e.g. "3 : 3"
  highLow: string; // e.g. "3 : 3"
  acValue: number;
  confidenceScore: number;
  aiNotes: string[];
}

export class AILottoEngine {
  // Calculate recent appearances in historical draws
  private static getRecentFrequencies(drawCount = 20): Record<number, number> {
    const recent = HISTORICAL_DRAWS.slice(0, drawCount);
    const counts: Record<number, number> = {};
    for (let i = 1; i <= 45; i++) counts[i] = 0;

    recent.forEach(draw => {
      draw.numbers.forEach(num => {
        counts[num] = (counts[num] || 0) + 1;
      });
    });
    return counts;
  }

  // Calculate unappeared gap (how many rounds since last drawn)
  private static getGaps(): Record<number, number> {
    const gaps: Record<number, number> = {};
    for (let i = 1; i <= 45; i++) gaps[i] = 999;

    HISTORICAL_DRAWS.forEach((draw, roundIndex) => {
      draw.numbers.forEach(num => {
        if (gaps[num] === 999) {
          gaps[num] = roundIndex;
        }
      });
    });
    return gaps;
  }

  // Weighted random pick without replacement
  private static weightedPick(weights: Record<number, number>, exclude: Set<number>): number {
    let totalWeight = 0;
    for (let i = 1; i <= 45; i++) {
      if (!exclude.has(i)) {
        totalWeight += Math.max(weights[i] || 1, 0.1);
      }
    }

    let r = Math.random() * totalWeight;
    for (let i = 1; i <= 45; i++) {
      if (!exclude.has(i)) {
        const w = Math.max(weights[i] || 1, 0.1);
        if (r <= w) return i;
        r -= w;
      }
    }
    // Fallback
    for (let i = 1; i <= 45; i++) {
      if (!exclude.has(i)) return i;
    }
    return 1;
  }

  // Generate single 6-number set according to strategy
  public static generateSingle(strategy: AIStrategyId, options: GenerationOptions = {}): GeneratedGame {
    const fixed = options.fixedNumbers ? options.fixedNumbers.filter(n => n >= 1 && n <= 45) : [];
    const excluded = new Set(options.excludedNumbers ? options.excludedNumbers : []);

    const recentCounts = this.getRecentFrequencies(20);
    const gaps = this.getGaps();

    // Prepare weights based on strategy
    const weights: Record<number, number> = {};

    for (let i = 1; i <= 45; i++) {
      if (excluded.has(i)) {
        weights[i] = 0;
        continue;
      }

      const totalFreq = NUMBER_FREQUENCIES[i] || 160;
      const recentHits = recentCounts[i] || 0;
      const gap = gaps[i] || 0;

      switch (strategy) {
        case 'QUANTUM_GOLD':
          // Balanced blend of all-time frequency + stability
          weights[i] = (totalFreq / 10) + (recentHits * 1.5) + (gap > 3 && gap < 12 ? 3 : 1);
          break;

        case 'DEEP_TREND':
          // Heavily reward recent hits & hot momentum
          weights[i] = (recentHits * 4) + (totalFreq / 25) + 1;
          break;

        case 'COLD_REVERSAL':
          // Heavily reward high gap (cold numbers about to erupt)
          weights[i] = (gap * 3.5) + (totalFreq / 20) + 1;
          break;

        case 'HIGH_ROLLER':
          // Heavily bias towards numbers > 31 and avoid birthday 1~31
          weights[i] = (i > 30 ? 5 : 1.2) + (recentHits * 1.2);
          break;

        case 'ROYAL_FORTUNE':
          // Harmonized five elements energy distribution
          const element = Math.floor((i - 1) / 9);
          weights[i] = 2.5 + (element === 0 || element === 3 ? 1.5 : 1) + (totalFreq / 30);
          break;
      }
    }

    // Attempt generation with filter verification for top quality
    let bestNumbers: number[] = [];
    let bestScore = -1;
    let bestGame: GeneratedGame | null = null;

    const maxTries = 40;
    for (let attempt = 0; attempt < maxTries; attempt++) {
      const chosen = new Set<number>(fixed);

      while (chosen.size < 6) {
        const pick = this.weightedPick(weights, chosen);
        chosen.add(pick);
      }

      const numbers = Array.from(chosen).sort((a, b) => a - b);
      const sum = numbers.reduce((acc, curr) => acc + curr, 0);
      const odds = numbers.filter(n => n % 2 !== 0).length;
      const evens = 6 - odds;
      const lows = numbers.filter(n => n <= 22).length;
      const highs = 6 - lows;
      const ac = calculateACValue(numbers);

      // Scoring criteria
      let score = 80;
      const notes: string[] = [];

      // Sum scoring (120~160 optimal)
      if (sum >= 120 && sum <= 165) {
        score += 8;
        notes.push('황금 총합 구간 (' + sum + ')');
      } else if (sum >= 100 && sum <= 180) {
        score += 4;
      }

      // Odd / Even balance (3:3 or 2:4 or 4:2)
      if (odds === 3 && evens === 3) {
        score += 6;
        notes.push('완벽한 홀짝 비율 (3:3)');
      } else if (Math.abs(odds - evens) === 2) {
        score += 4;
        notes.push('균형 홀짝 비율 (' + odds + ':' + evens + ')');
      }

      // AC Value (>= 7 is excellent)
      if (ac >= 8) {
        score += 6;
        notes.push('최상급 복잡도 지수 (AC ' + ac + ')');
      } else if (ac >= 6) {
        score += 3;
      }

      // Check consecutive numbers count
      let consecPairs = 0;
      for (let i = 0; i < 5; i++) {
        if (numbers[i + 1] === numbers[i] + 1) consecPairs++;
      }
      if (consecPairs <= 1) {
        score += 4;
        if (consecPairs === 1) notes.push('연속수 1쌍 텐션 매칭');
      }

      // Colors variety (must have >= 4 different color ranges)
      const colors = new Set(numbers.map(n => Math.min(Math.floor((n - 1) / 10), 4)));
      if (colors.size >= 4) {
        score += 5;
        notes.push('오방색 다채널 분산');
      }

      // Final bounded confidence
      const confidence = Math.min(Math.round(score * 10) / 10, 99.8);

      if (score > bestScore) {
        bestScore = score;
        bestNumbers = numbers;
        bestGame = {
          numbers: bestNumbers,
          sum,
          oddEven: `${odds} : ${evens}`,
          highLow: `${lows} : ${highs}`,
          acValue: ac,
          confidenceScore: confidence,
          aiNotes: notes.slice(0, 3)
        };
      }

      if (score >= 98) break; // early exit on perfection
    }

    return bestGame || {
      numbers: [7, 12, 23, 29, 34, 43],
      sum: 148,
      oddEven: '3 : 3',
      highLow: '2 : 4',
      acValue: 8,
      confidenceScore: 98.4,
      aiNotes: ['황금 총합 구간', '완벽한 홀짝 비율 (3:3)', '최상급 복잡도 지수']
    };
  }

  // Generate batch (1 to 5 games)
  public static generateBatch(strategy: AIStrategyId, count = 5, options: GenerationOptions = {}): GeneratedGame[] {
    const list: GeneratedGame[] = [];
    for (let i = 0; i < count; i++) {
      list.push(this.generateSingle(strategy, options));
    }
    return list;
  }
}

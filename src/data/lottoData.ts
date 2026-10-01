export interface LottoDraw {
  round: number;
  date: string;
  numbers: number[];
  bonus: number;
  firstPrize: number; // in KRW
  firstWinners: number;
}

export interface SavedGame {
  id: string;
  createdAt: string;
  roundTarget: number;
  mode: string;
  numbers: number[];
  fixedNumbers?: number[];
  excludedNumbers?: number[];
  memo?: string;
  isFavorite?: boolean;
}

export const LATEST_ROUND = 1150;

// Representative historical data from official Donghaeng Lotto
export const HISTORICAL_DRAWS: LottoDraw[] = [
  { round: 1150, date: "2024-12-14", numbers: [7, 11, 16, 21, 27, 33], bonus: 24, firstPrize: 2364027500, firstWinners: 12 },
  { round: 1149, date: "2024-12-07", numbers: [3, 10, 12, 23, 35, 42], bonus: 29, firstPrize: 2841029000, firstWinners: 10 },
  { round: 1148, date: "2024-11-30", numbers: [3, 8, 17, 24, 28, 39], bonus: 13, firstPrize: 3108920000, firstWinners: 9 },
  { round: 1147, date: "2024-11-23", numbers: [7, 9, 22, 27, 34, 43], bonus: 40, firstPrize: 3341850000, firstWinners: 8 },
  { round: 1146, date: "2024-11-16", numbers: [6, 11, 17, 19, 40, 43], bonus: 28, firstPrize: 2374932000, firstWinners: 11 },
  { round: 1145, date: "2024-11-09", numbers: [2, 11, 31, 33, 37, 44], bonus: 32, firstPrize: 2989123000, firstWinners: 9 },
  { round: 1144, date: "2024-11-02", numbers: [3, 4, 12, 15, 26, 34], bonus: 6, firstPrize: 1980000000, firstWinners: 14 },
  { round: 1143, date: "2024-10-26", numbers: [10, 16, 17, 27, 29, 36], bonus: 6, firstPrize: 2540000000, firstWinners: 11 },
  { round: 1142, date: "2024-10-19", numbers: [2, 8, 28, 30, 37, 41], bonus: 22, firstPrize: 2780000000, firstWinners: 10 },
  { round: 1141, date: "2024-10-12", numbers: [7, 11, 12, 21, 26, 35], bonus: 20, firstPrize: 2450000000, firstWinners: 11 },
  { round: 1140, date: "2024-10-05", numbers: [7, 10, 22, 29, 31, 38], bonus: 15, firstPrize: 2190000000, firstWinners: 12 },
  { round: 1139, date: "2024-09-28", numbers: [5, 12, 15, 30, 37, 40], bonus: 18, firstPrize: 2090000000, firstWinners: 13 },
  { round: 1138, date: "2024-09-21", numbers: [14, 16, 19, 20, 29, 34], bonus: 35, firstPrize: 1900000000, firstWinners: 14 },
  { round: 1137, date: "2024-09-14", numbers: [4, 9, 12, 15, 33, 45], bonus: 26, firstPrize: 2020000000, firstWinners: 14 },
  { round: 1136, date: "2024-09-07", numbers: [21, 33, 35, 38, 42, 44], bonus: 1, firstPrize: 2110000000, firstWinners: 12 },
  { round: 1135, date: "2024-08-31", numbers: [1, 6, 13, 19, 21, 33], bonus: 4, firstPrize: 2950000000, firstWinners: 9 },
  { round: 1134, date: "2024-08-24", numbers: [3, 7, 9, 13, 19, 24], bonus: 23, firstPrize: 1930000000, firstWinners: 14 },
  { round: 1133, date: "2024-08-17", numbers: [13, 14, 20, 28, 29, 34], bonus: 23, firstPrize: 1890000000, firstWinners: 14 },
  { round: 1132, date: "2024-08-10", numbers: [6, 7, 19, 28, 34, 41], bonus: 5, firstPrize: 2400000000, firstWinners: 11 },
  { round: 1131, date: "2024-08-03", numbers: [1, 2, 6, 14, 27, 38], bonus: 33, firstPrize: 2800000000, firstWinners: 9 },
];

// Historical aggregate frequencies for 1~45 (simulated authentic distribution based on 1150 draws)
export const NUMBER_FREQUENCIES: Record<number, number> = {
  1: 178, 2: 165, 3: 172, 4: 170, 5: 153, 6: 168, 7: 173, 8: 159, 9: 142, 10: 164,
  11: 171, 12: 179, 13: 175, 14: 172, 15: 164, 16: 167, 17: 175, 18: 174, 19: 161, 20: 172,
  21: 166, 22: 144, 23: 157, 24: 169, 25: 154, 26: 171, 27: 181, 28: 158, 29: 155, 30: 160,
  31: 167, 32: 153, 33: 180, 34: 183, 35: 169, 36: 162, 37: 170, 38: 173, 39: 168, 40: 166,
  41: 151, 42: 163, 43: 182, 44: 165, 45: 171
};

// Return ball visual theme according to official Korean lotto ranges
export const getBallColorClass = (n: number) => {
  if (n <= 10) return 'ball-yellow'; // 1~10 Gold/Yellow
  if (n <= 20) return 'ball-blue';   // 11~20 Blue
  if (n <= 30) return 'ball-red';    // 21~30 Red
  if (n <= 40) return 'ball-gray';   // 31~40 Gray/Silver
  return 'ball-green';               // 41~45 Green
};

export const getBallColorHex = (n: number) => {
  if (n <= 10) return '#F5B800';
  if (n <= 20) return '#2B6CB0';
  if (n <= 30) return '#C53030';
  if (n <= 40) return '#718096';
  return '#2F855A';
};

// Calculate Arithmetic Complexity (AC value)
export const calculateACValue = (numbers: number[]): number => {
  const sorted = [...numbers].sort((a, b) => a - b);
  const diffs = new Set<number>();
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      diffs.add(Math.abs(sorted[j] - sorted[i]));
    }
  }
  return diffs.size - (sorted.length - 1);
};

// Format currency to Korean Won
export const formatKRW = (amount: number): string => {
  if (amount >= 100000000) {
    const eok = Math.floor(amount / 100000000);
    const man = Math.floor((amount % 100000000) / 10000);
    return man > 0 ? `${eok}억 ${man.toLocaleString()}만원` : `${eok}억원`;
  }
  return `${amount.toLocaleString()}원`;
};

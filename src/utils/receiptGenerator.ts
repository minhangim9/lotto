import { getBallColorHex } from '../data/lottoData';

interface ReceiptGame {
  numbers: number[];
  confidenceScore: number;
}

export function generateVIPReceiptImage(
  games: ReceiptGame[],
  strategyName: string,
  targetRound: number,
  serialNumber: string
): string {
  const canvas = document.createElement('canvas');
  const width = 800;
  const height = 1100;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Deep Obsidian Gradient Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#161726');
  bgGrad.addColorStop(0.5, '#0B0C12');
  bgGrad.addColorStop(1, '#050508');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Ornate Double Gold Borders
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  ctx.strokeStyle = '#996515';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Corner Ornaments
  const drawCorner = (x: number, y: number, rot: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(0, 0, 24, 4);
    ctx.fillRect(0, 0, 4, 24);
    ctx.restore();
  };
  drawCorner(44, 44, 0);
  drawCorner(width - 44, 44, Math.PI / 2);
  drawCorner(width - 44, height - 44, Math.PI);
  drawCorner(44, height - 44, -Math.PI / 2);

  // 3. Header Crown & Brand
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFE072';
  ctx.font = 'bold 18px Pretendard, sans-serif';
  ctx.fillText('★ ★ ★  VVIP 1등 골든 티켓 인증서  ★ ★ ★', width / 2, 85);

  const goldTextGrad = ctx.createLinearGradient(width / 2 - 200, 110, width / 2 + 200, 150);
  goldTextGrad.addColorStop(0, '#FFE899');
  goldTextGrad.addColorStop(0.5, '#E5BE42');
  goldTextGrad.addColorStop(1, '#946B00');

  ctx.fillStyle = goldTextGrad;
  ctx.font = '900 42px Pretendard, sans-serif';
  ctx.fillText('ROYAL LOTTO VIP', width / 2, 140);

  ctx.fillStyle = '#A0A0B0';
  ctx.font = '16px Pretendard, sans-serif';
  ctx.fillText(`제 ${targetRound}회차 동행복권 1등 대비 엄선 추천 조합`, width / 2, 175);

  // Metadata Box
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.fillRect(70, 200, width - 140, 60);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(70, 200, width - 140, 60);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 14px Pretendard, sans-serif';
  ctx.fillText(`엔진: ${strategyName}`, 90, 235);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#CCCCCC';
  ctx.font = 'mono 13px Courier, monospace';
  ctx.fillText(`시리얼: ${serialNumber}`, width - 90, 235);

  // 4. Games List (A, B, C, D, E)
  let startY = 295;
  const letters = ['A', 'B', 'C', 'D', 'E'];

  games.forEach((game, gIdx) => {
    const cardY = startY + gIdx * 105;

    // Card background
    ctx.fillStyle = 'rgba(22, 23, 34, 0.6)';
    ctx.fillRect(70, cardY, width - 140, 90);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(70, cardY, width - 140, 90);

    // Letter badge
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.arc(115, cardY + 45, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0B0C10';
    ctx.font = 'bold 20px Pretendard, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(letters[gIdx] || `${gIdx + 1}`, 115, cardY + 52);

    // Draw 6 balls
    const ballStartX = 180;
    const ballSpacing = 72;
    game.numbers.forEach((num, bIdx) => {
      const bx = ballStartX + bIdx * ballSpacing;
      const by = cardY + 45;
      const radius = 25;

      // Ball gradient
      const ballGrad = ctx.createRadialGradient(bx - 7, by - 7, 3, bx, by, radius);
      const hex = getBallColorHex(num);
      ballGrad.addColorStop(0, '#FFFFFF');
      ballGrad.addColorStop(0.3, hex);
      ballGrad.addColorStop(1, '#000000');

      ctx.fillStyle = ballGrad;
      ctx.beginPath();
      ctx.arc(bx, by, radius, 0, Math.PI * 2);
      ctx.fill();

      // Ball inner white circle for number
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(bx, by, 13, 0, Math.PI * 2);
      ctx.fill();

      // Number text
      ctx.fillStyle = '#111111';
      ctx.font = '900 15px Pretendard, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(num.toString(), bx, by + 5);
    });

    // Score badge on right
    ctx.textAlign = 'right';
    ctx.fillStyle = '#FFE072';
    ctx.font = 'bold 15px Pretendard, sans-serif';
    ctx.fillText(`${game.confidenceScore}%`, width - 95, cardY + 42);
    ctx.fillStyle = '#888899';
    ctx.font = '11px Pretendard, sans-serif';
    ctx.fillText('AI적합도', width - 95, cardY + 60);
  });

  // 5. Official Golden Seal & Footer
  const footerY = 860;
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(70, footerY);
  ctx.lineTo(width - 70, footerY);
  ctx.stroke();

  // Seal circle
  ctx.save();
  ctx.translate(width - 150, footerY + 80);
  ctx.rotate(-0.15);
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.arc(0, 0, 52, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = 'rgba(212, 175, 55, 0.1)';
  ctx.fill();

  ctx.setLineDash([]);
  ctx.fillStyle = '#FFE072';
  ctx.textAlign = 'center';
  ctx.font = 'bold 13px Pretendard, sans-serif';
  ctx.fillText('ROYAL LOTTO', 0, -10);
  ctx.font = '900 15px Pretendard, sans-serif';
  ctx.fillText('★ VIP SEAL ★', 0, 10);
  ctx.font = '10px Pretendard, sans-serif';
  ctx.fillText('GUARANTEED', 0, 26);
  ctx.restore();

  // Barcode visualization
  ctx.fillStyle = '#E5BE42';
  const barStartY = footerY + 30;
  for (let i = 0; i < 60; i++) {
    const barW = (i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1);
    ctx.fillRect(80 + i * 7, barStartY, barW, 40);
  }

  ctx.textAlign = 'left';
  ctx.fillStyle = '#888899';
  ctx.font = '11px monospace';
  ctx.fillText(`OFFICIAL BARCODE: ${serialNumber}`, 80, barStartY + 60);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#555566';
  ctx.font = '12px Pretendard, sans-serif';
  ctx.fillText('본 증명서는 로얄 로또 VIP 인공지능 퀀텀 알고리즘을 통해 발행되었습니다.', width / 2, height - 55);

  return canvas.toDataURL('image/png');
}

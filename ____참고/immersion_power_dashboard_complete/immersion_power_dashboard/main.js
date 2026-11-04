'use strict';

// Chart.js 공식 doughnut 차트 + 커스텀 플러그인으로 원본 시안의 이중 링을 재현합니다.
const startAngle = Math.PI * 0.75;
const sweep = Math.PI * 1.5;

function paintGauge(ctx, width, height, value, max, color) {
  const cx = width / 2;
  const cy = height / 2 + 1;
  const r = Math.min(width, height) * 0.415;
  const fraction = Math.min(Math.max(value / max, 0), 1);
  const endAngle = startAngle + sweep;
  const activeEnd = startAngle + sweep * fraction;
  const css = getComputedStyle(document.documentElement);
  const text = css.getPropertyValue('--text').trim() || '#eef4ff';
  ctx.save();
  ctx.lineCap = 'round';
  // 전체 트랙이 뒤에 깔리고, 컬러 아크는 위에 중첩됩니다.
  ctx.beginPath(); ctx.arc(cx, cy, r, startAngle, endAngle); ctx.lineWidth = 8; ctx.strokeStyle = '#071629'; ctx.stroke();
  if (fraction > 0) {
    ctx.beginPath(); ctx.arc(cx, cy, r, startAngle, activeEnd); ctx.lineWidth = 8; ctx.strokeStyle = color; ctx.stroke();
  }
  // 중앙 원형은 값 전달용 표시 영역이며 사용률과 독립입니다.
  ctx.beginPath(); ctx.arc(cx, cy, r * .68, 0, Math.PI * 2); ctx.fillStyle = '#142b49'; ctx.fill();
  ctx.lineWidth = 1.8; ctx.strokeStyle = color; ctx.stroke();
  ctx.fillStyle = text; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const valueText = value.toFixed(1);
  ctx.font = '700 20px Arial, sans-serif'; ctx.fillText(valueText, cx - 4, cy + 2);
  const txtWidth = ctx.measureText(valueText).width;
  ctx.font = '11px Arial, sans-serif'; ctx.fillText('kW', cx + txtWidth / 2 + 9, cy + 4);
  ctx.font = '12px Arial, sans-serif'; ctx.fillStyle = '#d5e2f5';
  ctx.textAlign = 'left'; ctx.fillText(max.toFixed(1), 6, 10);
  ctx.textAlign = 'right'; ctx.fillText('0', width - 5, height - 9);
  ctx.restore();
}

const overlayGauge = {
  id: 'overlayGauge',
  afterDraw(chart) {
    const {value, max, color} = chart.options.plugins.overlayGauge;
    paintGauge(chart.ctx, chart.width, chart.height, value, max, color);
  }
};

function createGauge(canvas) {
  const {value, max, color} = canvas.dataset;
  const settings = { value: Number(value), max: Number(max), color };
  if (typeof Chart !== 'undefined') {
    new Chart(canvas, {
      type: 'doughnut',
      data: { datasets: [{ data: [1], backgroundColor: ['rgba(0,0,0,0)'], borderWidth: 0 }] },
      plugins: [overlayGauge],
      options: {
        responsive: true, maintainAspectRatio: false, animation: false,
        events: [], layout: { padding: 0 },
        plugins: { legend: { display: false }, tooltip: { enabled: false }, overlayGauge: settings }
      }
    });
  } else {
    // CDN 연결이 되지 않는 내부망에서도 시안 확인이 가능하도록 Canvas 대체 렌더링 제공.
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr); canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    paintGauge(ctx, rect.width, rect.height, settings.value, settings.max, settings.color);
  }
}

document.querySelectorAll('.power-card__gauge canvas').forEach(createGauge);

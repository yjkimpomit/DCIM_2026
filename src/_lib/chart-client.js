// @/_lib/chart-client.js
'use client';
import Highcharts from 'highcharts';

const loaded = new Set();

function applyModule(mod) {
  const maybe = mod?.default ?? mod;
  if (typeof maybe === 'function') {
    // ESM/UMD에서 'factory(Highcharts)' 형태
    maybe(Highcharts);
  } 
}

async function loadMore() {
  try {
    const m = await import('highcharts/es-modules/masters/highcharts-more.src.js');
    applyModule(m);
  } catch {
    // UMD 경로: 전역 필요
    if (typeof window !== 'undefined' && !window.Highcharts) window.Highcharts = Highcharts;
    const m = await import('highcharts/highcharts-more');
    applyModule(m);
  }
  loaded.add('more');
}

async function loadSolidGauge() {
  try {
    const m = await import('highcharts/es-modules/masters/modules/solid-gauge.src.js');
    applyModule(m);
  } catch {
    if (typeof window !== 'undefined' && !window.Highcharts) window.Highcharts = Highcharts;
    const m = await import('highcharts/modules/solid-gauge');
    applyModule(m);
  }
  loaded.add('solidgauge');
}

async function loadExporting() {
  try {
    const m = await import('highcharts/es-modules/masters/modules/exporting.src.js');
    applyModule(m);
  } catch {
    if (typeof window !== 'undefined' && !window.Highcharts) window.Highcharts = Highcharts;
    const m = await import('highcharts/modules/exporting');
    applyModule(m);
  }
  loaded.add('exporting');
}

export async function getHighcharts(mods = []) {
  if (typeof window === 'undefined') return Highcharts; // SSR 가드
  if (!window.Highcharts) window.Highcharts = Highcharts; // UMD 대비

  for (const name of mods) {
    if (loaded.has(name)) continue;
    if (name === 'more')        await loadMore();
    else if (name === 'solidgauge') await loadSolidGauge();
    else if (name === 'exporting')  await loadExporting();
    else console.warn('[highcharts] unknown module:', name);
  }
  return Highcharts;
}

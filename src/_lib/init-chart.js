"use client"

import {createGauge} from "@/_lib/chart-power";
import {createResourceChart} from "@/_lib/chart-server";

function getEl(idOrEl) {
  return typeof idOrEl === 'string' ? document.getElementById(idOrEl) : idOrEl;
}

const toNum = (x) => {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;  // NaN/빈값은 0 등 기본값
};

const toNumArr = (arr) => (Array.isArray(arr) ? arr.map(toNum) : []);

async function initChartData(dataServer1, total_power,system_power,server_power){
      const need = id => !!getEl(id);

	const d1 = toNumArr(dataServer1);
	
	// 서버 리소스(해당 id가 있을 때만 그림)
	if (need('server-1')) await createResourceChart(getEl('server-1'), 'data-values-1', 'SERVER RESOURCE #1', d1);
	if (need('server-2')) await createResourceChart(getEl('server-2'), 'data-values-2', 'SERVER RESOURCE #2', [30.4,40.7,75.8,60.3]);
	if (need('server-3')) await createResourceChart(getEl('server-3'), 'data-values-3', 'SERVER RESOURCE #3', [25.5,45.3,80.1,55.6]);
	if (need('server-4')) await createResourceChart(getEl('server-4'), 'data-values-4', 'SERVER RESOURCE #4', [40.2,38.8,85.0,65.1]);

	// 게이지(해당 id가 있을 때만 그림)
	if (need('gauge-1')) await createGauge(getEl('gauge-1'), 'TOTAL POWER', total_power*1, 55, 'Kw', '#CCFF24');
	if (need('gauge-2')) await createGauge(getEl('gauge-2'), 'SYSTEM POWER', system_power*1, 5.0, 'Kw', '#40D2FF');
	if (need('gauge-3')) await createGauge(getEl('gauge-3'), 'SERVER POWER', server_power*1, 50.0, 'Kw', '#FFFC00');
		
	// // 함수 호출 (각 div에 id가 있어야 함)
	// await createResourceChart('server-1', 'data-values-1', 'SERVER RESOURCE #1', d1);
	// await createResourceChart('server-2', 'data-values-2', 'SERVER RESOURCE #2', d1);
	// await createResourceChart('server-3', 'data-values-3', 'SERVER RESOURCE #3', d1);
	// await createResourceChart('server-4', 'data-values-4', 'SERVER RESOURCE #4', d1);

	// power gauge chart
	// await createGauge('gauge-1', 'TOTAL POWER', 5.0, 55, 'Kw', '#CCFF24');
	// await createGauge('gauge-2', 'SYSTEM POWER', 0.1, 5.0, 'Kw', '#40D2FF');
	// await createGauge('gauge-3', 'SERVER POWER', 8.3, 50.0, 'Kw', '#FFFC00');

// })
}

export {
    initChartData
}
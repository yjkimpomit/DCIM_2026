'use client';
import { getHighcharts } from "./chart-client";

export async function createResourceChart(containerId, dataValuesId, title, data) {
  	const HC = await getHighcharts(['more', 'solidgauge', 'exporting']);
	HC.chart(containerId, {
		
		chart: {
			type: 'bar',
			backgroundColor: 'transparent',
			height: 128
		},
		title: false,
		xAxis: {
			categories: ['CPU', 'GPU', 'MEMORY', 'RESOURCE'],
			labels: { style: { color: '#D3DBE7', fontSize: '13px', fontWeight: '500' } },
			lineColor: 'transparent',
			tickLength: 0
		},
		yAxis: {
			min: 0,
			max: 100,
			title: { text: null },
			labels: { enabled: false },
			gridLineWidth: 0
		},
		plotOptions: {
			bar: {
				pointWidth: 8,
				dataLabels: { enabled: false },
				stacking: 'normal',
				borderWidth: 2,
				borderColor: '#0000002d',
				borderRadius: {
					radius: '50%'
				},
			},
		
		},
		series: [
			{
				name: 'Background',
				data: [100, 100, 100, 100],
				color: 'rgba(0, 0, 0, 0.32)',
				enableMouseTracking: false,
				showInLegend: false,
			},
			{
				name: 'Actual Value',
				data: data,
				color: '#B4DD33',
			}
		],
		legend: {
			enabled: false
		},
		credits: { enabled: false },
		exporting:{
			buttons:{
				contextButton:{
					enabled:false
				}
			}
		}
	});

	//
	var container = document.getElementById(dataValuesId);
	container.innerHTML = data.map(v => `<div>${v}%</div>`).join('');
}
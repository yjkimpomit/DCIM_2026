'use client';
import { getHighcharts } from "./chart-client";

export async function createGauge(container, title, value, max, unit, color) {
	const HC = await getHighcharts(['more', 'solidgauge', 'exporting']);
	const startAngle = 150;
	const endAngle = 330;
	const min = 0;
	
	function calculateAngle(value, max) {
		return startAngle + ((value - min) / (max - min)) * (endAngle - startAngle);
	}

	// 예시: value에 따른 각도 계산
	const angle = calculateAngle(value, max);
	// console.log(title + ': value=' + value + ', angle=' + angle);
	
	HC.chart(container, {
		chart: {
			type: 'solidgauge',
			backgroundColor: 'transparent',
			height: '248px'
		},
		title: { text: '' },
		pane: {
			center: ['50%', '50%'],
			size: '100%',
			startAngle: startAngle,
			endAngle: endAngle,
			background: {
				backgroundColor: 'rgba(255, 255, 255, 0.1)',
				borderColor: 'transparent',
				innerRadius: '88%',
				outerRadius: '100%',
				shape: 'arc'
			}
		},
		yAxis: {
			min: min,
			max: max,
			tickPositions: [0, max],
			tickColor: "#e6e9ed44",
			minorTickInterval: null,
			tickPosition: 'inside',
			tickLength: 16,
			tickWidth: 1,
			lineWidth: 0,
			lineColor: 'transparent',
			labels: {
				style: { color: '#E6E9ED', fontSize: '14px', fontWeight: '500' },
				distance: 12
			}
		},
		tooltip: { enabled: false },
		plotOptions: {
			solidgauge: {
				dataLabels: {
					y: -20,
					borderWidth: 0,
					useHTML: true,
					format:
						'<div style="text-align:center" class="label-box">' +
						'<span style="font-size:24px; color:' + color + '">{y}</span>' +
						'<span style="font-size:14px; font-weight: 400; color:' + color + '"> ' + unit + '</span>' +
						'</div>'
				}
			}
		},
		credits: { enabled: false },
		series: [{
			name: title,
			data: [{
				y: value,
				color: color
			}],	
			rounded: true,
			radius: '100%',
			innerRadius: '88%'
		}],
		exporting:{
			buttons:{
				contextButton:{
					enabled:false
				}
			}
		}
	});
}

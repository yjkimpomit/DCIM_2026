"use client";

import { useEffect, useRef } from "react";

export default function PowerUsageChart({ title, categories, values, monthly = false }) {
	const containerRef = useRef(null);

	useEffect(() => {
		let disposed = false;
		let chart;

		async function renderChart() {
			const { default: Highcharts } = await import("highcharts");
			await import("highcharts/modules/accessibility");
			if (disposed) return;
			const styles = getComputedStyle(containerRef.current);
			const textColor = styles.getPropertyValue("--fg-neutral-stronger").trim();
			const color = monthly ? styles.getPropertyValue("--chart-6").trim() : textColor;
			chart = Highcharts.chart(containerRef.current, {
				chart: { type: "line", height: 268, backgroundColor: "transparent", spacing: [16, 16, 16, 0], style: { fontFamily: styles.fontFamily }, animation: false },
				title: { text: null },
				xAxis: { categories, tickLength: 0, lineWidth: 0, labels: { style: { color: textColor, fontSize: "9px" }, step: 1 } },
				yAxis: { min: 0, max: monthly ? 2000 : 200, tickInterval: monthly ? 500 : 50, title: { text: null }, gridLineWidth: 0, labels: { style: { color: textColor, fontSize: "12px" } } },
				legend: { enabled: false },
				credits: { enabled: false },
				tooltip: { valueSuffix: " kW" },
				accessibility: { description: `${title}. ${categories.length}개 기간의 전력사용량 추이`, point: { valueSuffix: "킬로와트" } },
				plotOptions: { series: { animation: false, marker: { enabled: false }, lineWidth: 2 } },
				series: [{ name: title, data: values, color }],
			});
		}

		renderChart();
		return () => { disposed = true; chart?.destroy(); };
	}, [title, categories, values, monthly]);

	return <div ref={containerRef} className="user-power-chart" />;
}

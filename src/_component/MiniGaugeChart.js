"use client";

import { useEffect, useRef } from "react";

export default function MiniGaugeChart({ label, value, max = 5, unit = "", color = "cyan", showScale = false, sweep = 210 }) {
	const containerRef = useRef(null);

	useEffect(() => {
		let disposed = false;
		let chart;

		async function renderChart() {
			const { default: Highcharts } = await import("highcharts");
			await import("highcharts/highcharts-more");
			await import("highcharts/modules/solid-gauge");
			if (disposed) return;
			const styles = getComputedStyle(containerRef.current);
			const textColor = styles.getPropertyValue("--fg-neutral-stronger").trim();
			const colorToken = { cyan: "--chart-1", lime: "--chart-2", orange: "--chart-5" }[color];
			chart = Highcharts.chart(containerRef.current, {
				chart: { type: "solidgauge", height: containerRef.current.clientHeight, backgroundColor: "transparent", spacing: [0, 0, 0, 0], animation: false, style: { fontFamily: styles.fontFamily } },
				title: { text: null }, credits: { enabled: false }, tooltip: { enabled: false }, accessibility: { enabled: false },
				pane: { center: ["50%", sweep > 210 ? "55%" : "65%"], size: sweep > 210 ? "90%" : "100%", startAngle: -sweep / 2, endAngle: sweep / 2, background: [{ outerRadius: "100%", innerRadius: "80%", borderWidth: 0, backgroundColor: styles.getPropertyValue("--bg-darknavy-subtler").trim(), shape: "arc" }] },
				yAxis: { min: 0, max, lineWidth: 0, tickLength: 0, minorTickInterval: null, tickPositions: showScale ? [0, max] : [], labels: { distance: 8, style: { color: textColor, fontSize: "11px" } } },
				plotOptions: { solidgauge: { animation: false, rounded: true, dataLabels: { enabled: false } } },
				series: [{ name: label, data: [{ y: value, color: styles.getPropertyValue(colorToken).trim() }], radius: "100%", innerRadius: "80%" }],
			});
		}

		renderChart();
		return () => { disposed = true; chart?.destroy(); };
	}, [label, value, max, color, showScale, sweep]);

	return (
		<div className={`immersion-gauge${sweep > 210 ? " immersion-gauge-deep" : ""}`} role="img" aria-label={`${label} ${value}${unit}`}>
			<div ref={containerRef} className="immersion-gauge-chart" aria-hidden="true" />
			<span className="immersion-gauge-value" aria-hidden="true">{value}{unit}</span>
		</div>
	);
}

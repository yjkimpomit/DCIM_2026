"use client";

import { useEffect, useRef } from "react";

export default function ResourceMeterChart({ label, value, color, displayValue }) {
  const containerRef = useRef(null);
  const percentage = Math.min(100, Math.max(0, Number(value) || 0));
  // 컴퓨팅 리소스(전체): 70% 이상 레드 / 50% 이상 오렌지 / 25% 이상 라임 / 0% 이상 시안.
  // color="usage"이면 사용률 구간에 따라 색상을 선택한다. UPS는 지정한 색상을 유지한다.
  const barColor = color === "usage"
    ? percentage >= 70 ? "red" : percentage >= 50 ? "orange" : percentage >= 25 ? "lime" : "cyan"
    : color;

  useEffect(() => {
    let disposed = false;
    let chart;

    async function renderChart() {
      const { default: Highcharts } = await import("highcharts");
      if (disposed) return;

      const styles = getComputedStyle(containerRef.current);
      const gradient = styles.getPropertyValue(`--chart-gradient-${barColor}`);
      const colors = gradient.match(/#[\da-f]{3,8}\b|rgba?\([^)]*\)/gi) || [];
      const trackColor = styles.getPropertyValue("--chart-bg").trim();
      chart = Highcharts.chart(containerRef.current, {
        chart: {
          type: "bar",
          height: 8,
          margin: 0,
          spacing: [0, 0, 0, 0],
          backgroundColor: "transparent",
          animation: false,
        },
        title: { text: null },
        xAxis: { categories: [label], visible: false },
        yAxis: { min: 0, max: 100, endOnTick: false, startOnTick: false, visible: false },
        legend: { enabled: false },
        tooltip: { enabled: false },
        credits: { enabled: false },
        // 바깥 meter 요소로 이름과 값을 제공하므로 SVG의 중복 읽기를 방지한다.
        accessibility: { enabled: false },
        plotOptions: {
          series: {
            animation: false,
            enableMouseTracking: false,
            states: { inactive: { opacity: 1 }, hover: { enabled: false } },
          },
          bar: { grouping: false, pointWidth: 8, borderWidth: 0, borderRadius: 4 },
        },
        series: [
          { name: "전체", data: [100], color: trackColor, zIndex: 0 },
          {
            name: label,
            data: [percentage],
            color: colors.length ? {
              // Highcharts bar의 반전 좌표를 보정해 화면의 위→아래로 적용한다.
              linearGradient: { x1: 1, y1: 0, x2: 0, y2: 0 },
              stops: colors.map((shade, index) => [[0.3, 0.8, 1][index] ?? 1, shade]),
            } : styles.getPropertyValue("--fg-primary-default").trim(),
            zIndex: 1,
          },
        ],
      });
    }

    renderChart();
    return () => {
      disposed = true;
      chart?.destroy();
    };
  }, [label, percentage, barColor]);

  return (
    <div className="user-resource-row">
      <span className="user-resource-label">{label}</span>
      <div className="user-meter" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage} aria-valuetext={displayValue ? `${displayValue} (${percentage}%)` : `${percentage}%`}>
        <div ref={containerRef} className="user-meter-chart" aria-hidden="true" />
      </div>
      <span className="user-resource-value">{displayValue ?? `${percentage}%`}</span>
    </div>
  );
}

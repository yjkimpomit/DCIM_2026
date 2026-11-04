"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Highcharts from "highcharts";

// HighchartsReact는 ssr: false 로 불러오기
const HighchartsReact = dynamic(() => import("highcharts-react-official"), {
  ssr: false,
});

export default function BarChart({
  container = "",
  dataValuesId = "",
  data = [70, 40, 85, 50], // CPU, GPU, MEMORY, RESOURCE 값
  categories = ["CPU", "MEMORY", "GPU", "RESOURCE"],
  barColor = "#B4DD33",
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);
  useEffect(() => {
    document.getElementById(dataValuesId).innerHTML = data.map(parseFloat).map(v => `<div>${v.toFixed(2)}%</div>`).join('')
  }, [data])

  if (!ready) return null;

  return (
    <HighchartsReact
      highcharts={Highcharts}
      className={container}
      options={{
        chart: {
          type: "bar",
          backgroundColor: "transparent",
          height: 128,
        },
        title: { text: "" },
        xAxis: {
          categories,
          labels: {
            style: {
              color: "#D3DBE7",
              fontSize: "13px",
              fontWeight: "500",
            },
          },
          lineColor: "transparent",
          tickLength: 0,
        },
        yAxis: {
          min: 0,
          max: 100,
          title: { text: null },
          labels: { enabled: false },
          gridLineWidth: 0,
        },
        plotOptions: {
          bar: {
            pointWidth: 8,
            dataLabels: { enabled: false },
            stacking: "normal",
            borderWidth: 2,
            borderColor: "#0000002d",
            borderRadius: 4, // ← 원래 radius:'50%' 대신 숫자로 지정해야 Highcharts에서 동작
          },
        },
        series: [
          {
            name: "Background",
            data: new Array(categories.length).fill(100), // [100,100,100,100]
            color: "rgba(0, 0, 0, 0.32)",
            enableMouseTracking: false,
            showInLegend: false,
          },
          {
            name: "Actual Value",
            data:data.map(parseFloat),
            color: barColor,
          },
        ],
        legend: { enabled: false },
        credits: { enabled: false },
      }}
    />
  );
}

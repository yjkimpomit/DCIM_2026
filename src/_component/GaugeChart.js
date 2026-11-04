"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Highcharts from "highcharts";

// HighchartsReact는 클라이언트 전용으로만 불러오기
const HighchartsReact = dynamic(() => import("highcharts-react-official"), {
  ssr: false,
});

// 안전하게 모듈 실행해주는 헬퍼
function initModule(mod, Highcharts) {
  if (!mod) return;
  if (typeof mod === "function") {
    mod(Highcharts);
  } else if (mod.default) {
    if (typeof mod.default === "function") {
      mod.default(Highcharts);
    } else if (mod.default.default && typeof mod.default.default === "function") {
      mod.default.default(Highcharts);
    }
  }
}

export default function GaugeChart({
  container = "",
  pointer = "",
  title = "",
  value = 0,
  max = 100,
  unit = "",
  color = "",
}) {
  const startAngle = 150;
  const endAngle = 330;
  const min = 0;

  const [ready, setReady] = useState(false);
function calculateAngle() {
		return startAngle + ((value - min) / (max - min)) * (endAngle - startAngle);
	}
  useEffect(() => {
    let mounted = true;

    async function loadModules() {
      const HighchartsMore = await import("highcharts/highcharts-more");
      const SolidGauge = await import("highcharts/modules/solid-gauge");

      // 안전하게 실행
      initModule(HighchartsMore, Highcharts);
      initModule(SolidGauge, Highcharts);

      if (mounted) setReady(true);
    }

    loadModules();

    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    let transform = `translate(-50%, -50%) rotate(${calculateAngle()}deg)`;
    console.log(transform)
    if(pointer) document.getElementsByClassName(pointer)[0].style.transform = transform
  }, [value])

  if (!ready) return null;

  return (
    <HighchartsReact
      callback={() => {
        let transform = `translate(-50%, -50%) rotate(${calculateAngle()}deg)`;
        console.log(transform)
        if(pointer) document.getElementsByClassName(pointer)[0].style.transform = transform
      }}
      highcharts={Highcharts}
      className={container}
      options={{
        chart: {
          type: "solidgauge",
          backgroundColor: "transparent",
          height: "248px",
        },
        title: { text: "" },
        pane: {
          center: ["50%", "50%"],
          size: "100%",
          startAngle,
          endAngle,
          background: {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: "transparent",
            innerRadius: "88%",
            outerRadius: "100%",
            shape: "arc",
          },
        },
        tooltip: { enabled: false },
        yAxis: {
          min,
          max,
          tickPositions: [0, max],
          tickColor: "#e6e9ed44",
          minorTickInterval: null,
          tickPosition: "inside",
          tickLength: 16,
          tickWidth: 1,
          lineWidth: 0,
          labels: {
            style: { color: "#E6E9ED", fontSize: "14px", fontWeight: "500" },
            distance: 12,
          },
        },
        plotOptions: {
          solidgauge: {
            dataLabels: {
              y: -20,
              borderWidth: 0,
              useHTML: true,
              format: `
                <div style="text-align:center" class="label-box">
                  <span style="font-size:24px; color:${color}">{y}</span>
                  <span style="font-size:14px; font-weight:400; color:${color}"> ${unit}</span>
                </div>`,
            },
          },
        },
        credits: { enabled: false },
        series: [
          {
            name: title,
            data: [{ y: value, color }],
            rounded: true,
            radius: "100%",
            innerRadius: "88%",
          },
        ],
      }}
    />
  );
}

// components/ImmersionSvg.js
'use client';
import { useEffect, useState } from 'react';
const x = 0;
const y = 0;

let positions = {
  setpoint_temp: { //setpoint temp
    x: `${10.6+x}%`, 
    y: `${11.5+y}%`,
  },
  actual_temp:{ //actual temp
    x: `${10.6+x}%`, 
    y: `${22.3+y}%`,
  },
  cooler_power:{ //cooler_power
    x: `${4.6+x}%`, 
    y: `${65.1+y}%`,
  },
  cooler_in_temp:{ //intel temp - btm
  x: `${21.5+x}%`,
 y: `${64.8+y}%`,
  },
  cooler_flow:{ //intel flow -btm
    x: `${29.5+x}%`,
     y: `${65+y}%`,
  },
  pue:{
    x: `${43+x}%`,
     y: `${81.6+y}%`,
  },
  total_power:{ //total power
     x: `${42+x}%`,
     y: `${70.7+y}%`,
  },
  system_power:{ //system power
     x: `${57.5+x}%`,
     y: `${74.7+y}%`,
  },
  tank_in_temp:{ //tank inlet - btm
     x: `${71.7+x}%`,
    y: `${69.5+y}%`,
  },
  server_power:{ //server power
    x: `${94.4+x}%`,
     y: `${69.3+y}%`,
  },
  tank_temp:{ //tank temp - right top
    x: `${96.3+x}%`,
    y: `${20.2+y}%`,
  },
  pressure:{ //pressure
     x: `${79.9+x}%`,
      y: `${26.8+y}%`,
  },
  tank_out_temp:{ //tank oulet -( top)
   x: `${80+x}%`,
  y: `${16+y}%`,

  },
  set_temp:{ //setpoint temp (top - right)
    x: `${80.3+x}%`,
    y: `${5.1+y}%`,
  },
  inverter_hz:{ //invert setup -top
     x: `${62.2+x}%`,
   y: `${7.2+y}%`,
  },
  pump_a_run:{
     x: `${62.4+x}%`,
    y: `${29.6+y}%`,
  },
  pump_b_run:{
   x: `${62.4+x}%`,
   y: `${49+y}%`,
  },
  coolant_flow:{ //inlet flow-top
  x: `${46.3+x}%`,
   y: `${19.5+y}%`,
  },
  cooler_out_temp:{ //outlet temp
   x: `${24.9+x}%`,
    y: `${19.6+y}%`,
  },
};

//for fake data position.
let fakePos = {
  setpoint_temp:{
    x: `${13.4+x}%`, 
    y: `${7+y}%`,
  },
    actual_temp:{ //actual temp
   x: `${13+x}%`, 
    y: `${17.8+y}%`,
  },
  cooler_power:{ //cooler_power
  x: `${7.6+x}%`, 
    y: `${60.5+y}%`,
  },
  pressure:{ //pressure
     x: `${81.7+x}%`,
      y: `${22.8+y}%`,
  },

}


export default function ImmersionSvg({
  src = '/images/immersion-unit.svg',
  data={   pue:0,
    setpoint_temp:0,
      actual_temp:0,
      pue:0,
      server_power:0,
      system_power:0,
      tank_temp:0,
      tank_out_temp:0,
      tank_in_temp:0,
      total_power:0,
      inverter_hz:0,
      clooer_flow:0,
      set_temp:0,
      cooler_flow:0,
      cooler_out_temp:0,
      cooler_in_temp:0,
      set_temp:0,
      pressure:0,
      cooler_power:0,
      pump_a_run:0,
      pump_b_run:0,
      coolant_flow:0
    },                       // 예: { setpoint_temp: 100, fan_rpm: 1200 }
  defaults = {                     // 공통 스타일 기본값
    fontSize: 24,
    fill: '#000',
    textAnchor: 'end',
    dominantBaseline: 'text-before-edge',
  },
  formatter,                       // (key, value) => string  커스텀 포맷터
  className = 'immersion-svg',
}) {
  const [markup, setMarkup] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (typeof window === 'undefined') return;

      const SVG_NS = 'http://www.w3.org/2000/svg';
      const raw = await (await fetch(src)).text();
      const doc = new DOMParser().parseFromString(raw, 'image/svg+xml');
      const svg = doc.documentElement;

      // 기존에 내가 만든 동적 텍스트들 정리(중복 방지)
      Array.from(svg.querySelectorAll('[data-dynamic="true"]')).forEach(n => n.remove());

      // positions의 각 key에 대해 텍스트 노드 생성/업데이트
      for (const [key, pos] of Object.entries(positions)) {
        // 값 결정
        const rawVal = data[key];
        const textVal =
          formatter ? formatter(key, rawVal) : (rawVal ?? '').toString();

        const {
          x, y,
          fontSize = 18,
          fill = defaults.fill,
          textAnchor = defaults.textAnchor,
          dominantBaseline = defaults.dominantBaseline,
          id = `dyn-${key}`,   // id 커스터마이즈 가능
        } = pos;

     const t = doc.createElementNS(SVG_NS, 'text');
      t.setAttribute('id', id);
      t.setAttribute('data-dynamic', 'true');
      t.setAttribute('x', String(x));
      t.setAttribute('y', String(y));
      t.setAttribute('text-anchor', textAnchor);          // 그대로 유지
      t.setAttribute('dominant-baseline', dominantBaseline);
      t.setAttribute('fill', fill);
      t.setAttribute('font-size', String(fontSize));

      const valueNode = doc.createTextNode(String(textVal));
      t.appendChild(valueNode);

      const unit = positions[key].unit;
      if (unit) {
        const unitSpan = doc.createElementNS(SVG_NS, 'tspan');
        unitSpan.setAttribute('font-size', String(Math.round(fontSize * 0.7))); // 숫자보다 70%
        unitSpan.setAttribute('dx', '2'); 
        unitSpan.setAttribute('dy', '5');  
        unitSpan.textContent = unit; 
        t.appendChild(unitSpan);
      }
        svg.appendChild(t);
      }

      //for fake data.
      for (const [key, pos] of Object.entries(fakePos)) {
          // 값 결정
        const {
          x, y,
          fontSize = 18,
          fill = "white",
          textAnchor = defaults.textAnchor,
          dominantBaseline = defaults.dominantBaseline,
          id = `fake-${key}`,   // id 커스터마이즈 가능
        } = pos;

     const t = doc.createElementNS(SVG_NS, 'text');
      t.setAttribute('id', id);
      t.setAttribute('data-dynamic', 'true');
      t.setAttribute('x', String(x));
      t.setAttribute('y', String(y));
      t.setAttribute('text-anchor', textAnchor);        
      t.setAttribute('dominant-baseline', dominantBaseline);
      t.setAttribute('fill', "white");
      t.setAttribute('font-size', String(fontSize));
      
      const valueNode = doc.createTextNode("*");
      t.appendChild(valueNode);
      svg.appendChild(t);
      
      }


      const out = new XMLSerializer().serializeToString(svg);
      if (!cancelled) setMarkup(out);
    })();

    return () => { cancelled = true; };
    // data/positions 바뀌면 다시 그리기
  }, [src, JSON.stringify(data), JSON.stringify(positions), JSON.stringify(defaults)]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
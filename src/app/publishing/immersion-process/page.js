import RoomPublishingFrame, {
  RoomPageHeading,
} from "@/_component/RoomPublishingFrame";
import MiniGaugeChart from "@/_component/MiniGaugeChart";
import ImmersionAlarmPreview from "@/_component/ImmersionAlarmPreview";

// immersion-monitoring 우측 패널과 동일한 항목 구성. 값은 퍼블리싱용 샘플이다.
const panels = [
  {
    title: "TOTAL POWER",
    value: 0.5,
    max: 5,
    color: "orange",
    fields: [
      ["PUE", "1.82"],
      ["Pressure*", "0.17bar"],
      ["ALARM", "12건"],
    ],
  },
  {
    title: "SYSTEM POWER",
    value: 0.2,
    max: 5,
    color: "cyan",
    fields: [
      ["Setpoint Temp", "48.0°C"],
      ["Inlet Flow(tank)", "27.0LPM"],
      ["Inverter Setup", "20.0Hz"],
    ],
  },
  {
    title: "SERVER POWER",
    value: 0.3,
    max: 5,
    color: "lime",
    fields: [
      ["Tank Temp", "30.8°C"],
      ["Tank Inlet", "31.1°C"],
      ["Tank Outlet", "31.7°C"],
    ],
  },
];

export default function ImmersionProcessPublishing() {
  return (
    <RoomPublishingFrame active="immersion-process">
      <main className="room-viewer">
        <RoomPageHeading title="프로세스 구성도" section="immersion" />
        <div className="room-model immersion-process-viewer">
          <iframe
            className="room-model-frame"
            src="/__sample/immersion-process-viewer.html"
            title="액침냉각 프로세스 구성도 임시 화면"
            allowFullScreen
          />
        </div>
      </main>
      <aside
        className="room-summary immersion-summary"
        aria-label="액침냉각 운전 정보"
      >
        {panels.map(({ title, value, max, color, fields }) => (
          <section className="room-summary-section" key={title}>
            <h2 className="room-summary-title">{title}</h2>
            <div className="panel-card immersion-power-card">
              <dl className="immersion-field-list">
                {fields.map(([label, fieldValue]) => (
                  <div className="immersion-field" key={label}>
                    <dt>{label}</dt>
                    <dd>{fieldValue}</dd>
                  </div>
                ))}
              </dl>
              <MiniGaugeChart
                label={title}
                value={value}
                max={max}
                unit="kW"
                color={color}
                showScale
              />
            </div>
          </section>
        ))}
        <ImmersionAlarmPreview />
      </aside>
    </RoomPublishingFrame>
  );
}

import RoomPublishingFrame, {
  RoomPageHeading,
} from "@/_component/RoomPublishingFrame";
import MiniGaugeChart from "@/_component/MiniGaugeChart";
import ResourceMeterChart from "@/_component/ResourceMeterChart";
import ImmersionResourcePreview from "@/_component/ImmersionResourcePreview";
import ImmersionAlarmPreview from "@/_component/ImmersionAlarmPreview";

export default function ImmersionDashboardPublishing() {
  return (
    <RoomPublishingFrame active="immersion-dashboard">
      <main className="room-viewer room-viewer-overlay">
        <RoomPageHeading title="대시보드" section="immersion" />
        <div className="room-model">
          {/* 실제 개발 시 액침냉각 3D 뷰어 주소로 교체한다. */}
          <iframe
            className="room-model-frame"
            src="/__sample/immersion-room-viewer.html"
            title="액침냉각 장비 배치 뷰어 임시 화면"
            allowFullScreen
          />
        </div>
      </main>
      {/* server-monitoring 우측 패널의 표시 항목을 재사용한 퍼블리싱 샘플. API 미연결. */}
      <aside
        className="room-summary immersion-summary"
        aria-label="액침냉각 현황"
      >
        <div className="immersion-metrics">
          <section>
            <h2 className="room-summary-title">PUE</h2>
            <div className="panel-card immersion-metric-card">
              <MiniGaugeChart label="PUE" value={1.82} max={3} color="cyan" />
            </div>
          </section>
          <section>
            <h2 className="room-summary-title">Tank Temp</h2>
            <div className="panel-card immersion-metric-card">
              <MiniGaugeChart
                label="Tank Temp"
                value={30.8}
                max={60}
                unit="°C"
                color="orange"
              />
            </div>
          </section>
        </div>
        <ImmersionResourcePreview />
        <section className="room-summary-section">
          <h2 className="room-summary-title">POWER</h2>
          {/* 개발 화면의 TOTAL / SYSTEM / SERVER POWER. 최대 5kW 기준 샘플 사용률. */}
          <div className="panel-card room-resource-list">
            <ResourceMeterChart label="TOTAL" value={10} color="lime" />
            <ResourceMeterChart label="SYSTEM" value={4} color="cyan" />
            <ResourceMeterChart label="SERVER" value={6} color="orange" />
          </div>
        </section>
        <ImmersionAlarmPreview />
      </aside>
    </RoomPublishingFrame>
  );
}

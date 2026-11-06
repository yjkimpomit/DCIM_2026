import ResourceMeterChart from "@/_component/ResourceMeterChart";
import CctvPreviewButton from "@/_component/CctvPreviewButton";
import RoomPublishingFrame, {
  RoomPageHeading,
} from "@/_component/RoomPublishingFrame";

export default function ServerDashboardPublishing() {
  return (
    <RoomPublishingFrame>
      <main className="room-viewer room-viewer-overlay">
        <RoomPageHeading title="대시보드" />
        <div className="room-model">
          <CctvPreviewButton />
          {/* 실제 개발 시 src를 서버룸 뷰어 주소로 교체. 현재는 이미지가 포함된 임시 화면. */}
          <iframe
            className="room-model-frame"
            src="/__sample/server-room-viewer.html"
            title="서버룸 장비 배치 뷰어"
            width={1143}
            height={777}
            allowFullScreen
          />
        </div>
      </main>

      <aside className="room-summary" aria-label="서버룸 현황">
        <section className="room-summary-section">
          <h2 className="room-summary-title">서버</h2>
          <dl className="room-server-counts">
            <div className="room-server-status room-server-normal">
              <dt>정상</dt>
              <dd>18건</dd>
            </div>
            <div className="room-server-status room-server-warning">
              <dt>점검</dt>
              <dd>2건</dd>
            </div>
          </dl>
        </section>
        <section className="room-summary-section">
          <h2 className="room-summary-title">환경</h2>
          <dl className="panel-card room-environment">
            <div className="room-environment-row">
              <dt>온도</dt>
              <dd className="room-environment-value">22.6°C</dd>
              <dd>
                <span className="badge badge-primary badge-solid badge-sm">
                  정상
                </span>
              </dd>
            </div>
            <div className="room-environment-row">
              <dt>습도</dt>
              <dd className="room-environment-value">55.2%</dd>
              <dd>
                <span className="badge badge-primary badge-solid badge-sm">
                  정상
                </span>
              </dd>
            </div>
          </dl>
        </section>
        <section className="room-summary-section" id="room-resources">
          <h2 className="room-summary-title">컴퓨팅 리소스(전체)</h2>
          <div className="panel-card room-resource-list">
            <ResourceMeterChart label="CPU" value={75} color="usage" />
            <ResourceMeterChart label="GPU" value={56} color="usage" />
            <ResourceMeterChart label="메모리" value={52} color="usage" />
            <ResourceMeterChart label="디스크" value={42} color="usage" />
          </div>
        </section>
        <section className="room-summary-section" id="room-power">
          <h2 className="room-summary-title">전력사용량</h2>
          <div className="panel-card room-power">
            <dl className="room-power-value">
              <dt>오늘</dt>
              <dd>158.7kw</dd>
            </dl>
            {/* 증감 표시: 증가 trending_up.svg / 감소 trending_down.svg. 변경 시 aria-label도 함께 수정 */}
            <span
              className="room-power-trend"
              role="img"
              aria-label="어제보다 증가"
            >
              <img
                className="room-icon"
                src="/images/icons/trending_up.svg"
                alt=""
                width={24}
                height={24}
              />
            </span>
            {/* 감소 시 사용:
                <span className="room-power-trend" role="img" aria-label="어제보다 감소"><img className="room-icon" src="/images/icons/trending_down.svg" alt="" width={24} height={24} /></span>
                */}
            <dl className="room-power-value room-power-previous">
              <dt>어제</dt>
              <dd>157.2kw</dd>
            </dl>
          </div>
        </section>
        <section className="room-summary-section">
          <h2 className="room-summary-title">UPS</h2>
          <div className="panel-card room-resource-list">
            <ResourceMeterChart label="배터리" value={92} color="cyan" />
            <ResourceMeterChart label="부하율" value={68} color="red" />
            <dl className="room-ups-history">
              <dt>전환이력</dt>
              <dd>
                <time dateTime="2026-10-18T03:24">2026-10-18 03:24</time>
              </dd>
            </dl>
          </div>
        </section>
      </aside>
    </RoomPublishingFrame>
  );
}

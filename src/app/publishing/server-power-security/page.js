import CctvCarousel from "@/_component/CctvCarousel";
import RoomPublishingFrame, {
  RoomPageHeading,
} from "@/_component/RoomPublishingFrame";
import ResourceMeterChart from "@/_component/ResourceMeterChart";
import PowerUsageChart from "@/_component/PowerUsageChart";

const dailyCategories = Array.from({ length: 31 }, (_, index) =>
  String(index + 1),
);
const dailyValues = [
  78, 123, 90, 105, 99, 107, 119, 103, 104, 109, 126, 117, 133, 114, 104, 127,
  105, 124, 109, 116, 99, 128, 105, 118, 116, 100, 121, 134, 143, 129, 146,
];
const monthlyCategories = Array.from(
  { length: 12 },
  (_, index) => `2026-${String(index + 1).padStart(2, "0")}`,
);
const monthlyValues = [
  780, 1300, 1120, 990, 1150, 1190, 920, 1120, 1230, 1120, 1200, 1100,
];
const eventTimes = ["10:00:22", "10:03:29", "10:06:36", "10:09:15", "10:12:22"];
const users = [
  "김민준",
  "이서연",
  "박지훈",
  "최하은",
  "정도윤",
  "강지우",
  "조현우",
  "윤수빈",
  "장서준",
  "임채원",
];

export default function ServerPowerSecurityPublishing() {
  return (
    <RoomPublishingFrame active="power">
      <main className="room-viewer room-page-content">
        <RoomPageHeading title="전력 및 보안" />
        <div className="room-page-body room-power-security-layout">
          <section
            className="room-power-section"
            aria-labelledby="power-section-title"
          >
            <h3 className="room-section-title" id="power-section-title">
              전력 &amp; UPS
            </h3>
            <div className="room-power-columns">
              <div className="room-detail-sidebar">
                <section className="panel-card room-detail-card">
                  <h4 className="room-panel-title">전력사용량 추이</h4>
                  <div className="room-power room-detail-power">
                    <dl className="room-power-value">
                      <dt>오늘</dt>
                      <dd>158.7kw</dd>
                    </dl>
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
                    {/* 감소 시 trending_down.svg로 교체하고 aria-label="어제보다 감소" 적용 */}
                    <dl className="room-power-value room-power-previous">
                      <dt>어제</dt>
                      <dd>157.2kw</dd>
                    </dl>
                  </div>
                </section>
                <section className="panel-card room-detail-card">
                  <h4 className="room-panel-title">UPS</h4>
                  <div className="room-usage-meters">
                    <ResourceMeterChart
                      label="배터리 잔량"
                      value={92}
                      color="cyan"
                    />
                    <ResourceMeterChart label="부하율" value={68} color="red" />
                  </div>
                </section>
                <section className="panel-card room-detail-card">
                  <h4 className="room-panel-title">
                    UPS 정전 전환 이력<small>(최근 5건)</small>
                  </h4>
                  <div className="room-table-scroll">
                    <table className="room-table room-table-compact">
                      <caption className="visually-hidden">
                        최근 UPS 정전 전환 이력 5건
                      </caption>
                      <thead>
                        <tr>
                          <th scope="col">알람 시각</th>
                          <th scope="col">이벤트 내용</th>
                        </tr>
                      </thead>
                      <tbody>
                        {eventTimes.map((time) => (
                          <tr key={time}>
                            <td>2025-09-12 {time}</td>
                            <td>정전 → UPS 전환</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
              <div className="room-detail-sidebar">
                <section className="panel-card room-detail-card">
                  <h4 className="room-panel-title">일별 전력사용량</h4>
                  <PowerUsageChart
                    title="일별 전력사용량"
                    categories={dailyCategories}
                    values={dailyValues}
                  />
                </section>
                <section className="panel-card room-detail-card">
                  <h4 className="room-panel-title">월별 전력사용량</h4>
                  <PowerUsageChart
                    title="월별 전력사용량"
                    categories={monthlyCategories}
                    values={monthlyValues}
                    monthly
                  />
                </section>
              </div>
            </div>
          </section>

          <section
            className="room-security-section"
            aria-labelledby="security-section-title"
          >
            <h3 className="room-section-title" id="security-section-title">
              보안
            </h3>
            <section className="panel-card room-detail-card room-access-card">
              <div className="room-card-heading">
                <h4 className="room-panel-title">
                  출입 통제 로그<small>(최근 10건)</small>
                </h4>
                <button
                  type="button"
                  className="room-card-button button-icon button-icon-add"
                  aria-label="출입 통제 로그 더보기"
                ></button>
              </div>
              <div className="room-table-scroll">
                <table className="room-table room-table-compact">
                  <caption className="visually-hidden">
                    최근 출입 통제 로그 10건
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">번호</th>
                      <th scope="col">일시</th>
                      <th scope="col">사용자</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((name, index) => (
                      <tr key={name}>
                        <td>{index + 1}</td>
                        <td>
                          2025-09-12{" "}
                          {index < 5
                            ? eventTimes[index]
                            : [
                                "10:15:29",
                                "10:18:36",
                                "10:21:15",
                                "10:24:22",
                                "10:27:29",
                              ][index - 5]}
                        </td>
                        <td>{name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <CctvCarousel />
          </section>
        </div>
      </main>
    </RoomPublishingFrame>
  );
}

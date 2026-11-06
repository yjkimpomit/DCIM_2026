export default function RoomSidebar({ active = "dashboard" }) {
  return (
          <aside className="room-sidebar" aria-label="날씨 및 주 메뉴">
            <section className="room-weather" aria-label="현재 날씨">
              <div className="room-weather-summary">
                {/* 날씨에 따라 아래 SVG 파일로 src 변경 (/images/icons/)
                    흐리고 비: weather-cloudy-rain.svg
                    비: weather-rain.svg
                    구름 조금: weather-partly-cloudy.svg
                    흐림: weather-cloudy.svg
                    맑음: weather-sunny.svg
                    눈: weather-snowy.svg
                */}
                <div className="room-weather-symbol"><img className="room-icon" src="/images/icons/weather-cloudy-rain.svg" alt="" width={48} height={48} /></div>
                <div><p className="room-temperature"><strong>20</strong><span>°C</span></p><time className="room-weather-date" dateTime="2026-06-11T14:29:27">2026.06.11 (목) 14:29:27</time></div>
              </div>
              <dl className="room-weather-details">
                {[["icon-rain", "강수확률", "20%"], ["icon-rainfall", "강수량", "0.0mm"], ["icon-humid", "습도", "55%"], ["icon-speed", "풍속", "2.0m/s"], ["icon-windy", "풍향", "남동"]].map(([icon, label, value]) => (
                  <div className="room-weather-detail" key={label}><dt><img className="room-icon" src={`/images/icons/${icon}.svg`} alt="" width={24} height={24} /><span className="visually-hidden">{label}</span></dt><dd>{value}</dd></div>
                ))}
              </dl>
            </section>

            <nav className="room-navigation" aria-label="관제 메뉴">
              <section className="room-nav-group">
                <h2 className="room-nav-title">SERVER ROOM MONITORING</h2>
                <ul className="room-nav-list">
                  <li><a className={`room-nav-link${active === "dashboard" ? " is-current" : ""}`} href="/publishing/server-dashboard" aria-current={active === "dashboard" ? "page" : undefined}>대시보드</a></li>
                  <li><a className={`room-nav-link${active === "computing" ? " is-current" : ""}`} href="/publishing/server-resources" aria-current={active === "computing" ? "page" : undefined}>컴퓨팅 리소스</a></li>
                  <li><a className={`room-nav-link${active === "power" ? " is-current" : ""}`} href="/publishing/server-power-security" aria-current={active === "power" ? "page" : undefined}>전력 및 보안</a></li>
                  <li><a className={`room-nav-link${active === "alarms" ? " is-current" : ""}`} href="/publishing/server-alarms" aria-current={active === "alarms" ? "page" : undefined}>알람</a></li>
                </ul>
              </section>
              <section className="room-nav-group">
                <h2 className="room-nav-title">IMMERSION COOLING MONITORING</h2>
                <ul className="room-nav-list">
                  <li><a className={`room-nav-link${active === "immersion-dashboard" ? " is-current" : ""}`} href="/publishing/immersion-dashboard" aria-current={active === "immersion-dashboard" ? "page" : undefined}>대시보드</a></li>
                  <li><a className={`room-nav-link${active === "immersion-process" ? " is-current" : ""}`} href="/publishing/immersion-process" aria-current={active === "immersion-process" ? "page" : undefined}>프로세스 구성도</a></li>
                  <li><a className="room-nav-link" href="/publishing/server-alarms">알람</a></li>
                </ul>
              </section>
            </nav>
          </aside>
  );
}

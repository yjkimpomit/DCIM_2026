import WeatherPanel from "@/_component/WeatherPanel";

export default function UserSidebar({ active = "dashboard" }) {
  return (
    <aside className="user-sidebar" aria-label="날씨 및 주 메뉴">
      <WeatherPanel />

      <nav className="user-navigation" aria-label="관제 메뉴">
        <section className="user-nav-group">
          <h2 className="user-nav-title">SERVER ROOM MONITORING</h2>
          <ul className="user-nav-list">
            <li><a className={`user-nav-link${active === "dashboard" ? " is-current" : ""}`} href="/server-dashboard" aria-current={active === "dashboard" ? "page" : undefined}>대시보드</a></li>
            <li><a className={`user-nav-link${active === "computing" ? " is-current" : ""}`} href="/server-resources" aria-current={active === "computing" ? "page" : undefined}>컴퓨팅 리소스</a></li>
            <li><a className={`user-nav-link${active === "power" ? " is-current" : ""}`} href="/server-power-security" aria-current={active === "power" ? "page" : undefined}>전력 및 보안</a></li>
            <li><a className={`user-nav-link${active === "alarms" ? " is-current" : ""}`} href="/server-alarms" aria-current={active === "alarms" ? "page" : undefined}>알람</a></li>
          </ul>
        </section>
        <section className="user-nav-group">
          <h2 className="user-nav-title">IMMERSION COOLING MONITORING</h2>
          <ul className="user-nav-list">
            <li><a className={`user-nav-link${active === "immersion-dashboard" ? " is-current" : ""}`} href="/immersion-dashboard" aria-current={active === "immersion-dashboard" ? "page" : undefined}>대시보드</a></li>
            <li><a className={`user-nav-link${active === "immersion-process" ? " is-current" : ""}`} href="/immersion-monitoring" aria-current={active === "immersion-process" ? "page" : undefined}>프로세스 구성도</a></li>
            <li><a className={`user-nav-link${active === "immersion-alarms" ? " is-current" : ""}`} href="/immersion-alarms" aria-current={active === "immersion-alarms" ? "page" : undefined}>알람</a></li>
          </ul>
        </section>
      </nav>
    </aside>
  );
}

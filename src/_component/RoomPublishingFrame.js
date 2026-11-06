import RoomSidebar from "@/_component/RoomSidebar";

export function RoomPageHeading({ title, section = "server" }) {
  return (
<div className="room-viewer-heading">
              <h2 className="room-page-title">{title}</h2>
              <nav aria-label="현재 위치">
                <ol className="room-breadcrumb">
                  <li><a className="room-breadcrumb-home" href={section === "immersion" ? "/publishing/immersion-dashboard" : "/publishing/server-dashboard"} aria-label="홈"></a></li>
                  <li className="room-breadcrumb-item"><span>{section === "immersion" ? "IMMERSION COOLING MONITORING" : "SERVER ROOM MONITORING"}</span></li>
                  <li className="room-breadcrumb-item"><span aria-current="page">{title}</span></li>
                </ol>
              </nav>
            </div>
  );
}

export default function RoomPublishingFrame({ active = "dashboard", children }) {
  const isDetail = ["computing", "power", "alarms"].includes(active);
  return (
    <>
      <link rel="stylesheet" href="/css/server-dashboard.css" />
      {active !== "dashboard" && <link rel="stylesheet" href="/css/server-room-pages.css" />}
      {active.startsWith("immersion") && <link rel="stylesheet" href="/css/immersion-pages.css" />}
      <div className="room-screen">
        <header className="room-header">
          <h1 className="logo">
            <img src="/images/pomit_white_h.svg" alt="POMIT" style={{height: "36px"}} width={100} height={36}/> <span>DCIM 시스템</span>
          </h1>
          <div className="room-header-actions">
            <time className="room-clock" dateTime="2026-09-08T09:08:24">2026-09-08 09:08:24</time>
            <a className="room-notifications button-icon button-icon-notifications" href="/publishing/server-alarms" aria-label="알림 12건">
              <span className="room-notification-count">12</span>
            </a>
            <a className="room-logout button-icon button-icon-exit button-icon-end" href="/login"><span>홍길동 로그아웃</span></a>
            <button type="button" className="room-settings button-icon button-icon-settings" aria-label="설정"></button>
          </div>
        </header>

        <div className={isDetail ? "room-layout room-layout-detail" : "room-layout"}>
          <RoomSidebar active={active} />

          {children}
        </div>
      </div>
    </>
  );
}

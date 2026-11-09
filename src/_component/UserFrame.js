import UserHeader from "@/_component/UserHeader";
import UserSidebar from "@/_component/UserSidebar";

export default function UserFrame({ active = "dashboard", children, screenClassName = "" }) {
  const isDetail = ["computing", "power", "alarms", "immersion-alarms"].includes(active);
  return (
    <>
      <link rel="stylesheet" href="/css/server-dashboard.css" />
      {active !== "dashboard" && <link rel="stylesheet" href="/css/server-room-pages.css" />}
      {active.startsWith("immersion") && <link rel="stylesheet" href="/css/immersion-pages.css" />}
      <div className={`user-screen${screenClassName ? ` ${screenClassName}` : ""}`}>
        <UserHeader />

        <div className={isDetail ? "user-layout user-layout-detail" : "user-layout"}>
          <UserSidebar active={active} />

          {children}
        </div>
      </div>
    </>
  );
}

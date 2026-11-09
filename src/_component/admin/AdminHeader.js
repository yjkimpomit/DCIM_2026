"use client";

import { useEffect, useState } from "react";

export default function AdminHeader({ initialTime }) {
  const [now, setNow] = useState(() => new Date(initialTime));

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const clock = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).format(now);

  return (
    <header className="admin-header">
      <div className="admin-brand">
        <h1 className="logo admin-logo">
          <img src="/images/pomit_white_h.svg" alt="POMIT" width={100} height={36} />
          <span>DCIM 시스템</span>
        </h1>
        <span className="admin-badge">관리자</span>
      </div>
      <div className="admin-header-actions">
        <time className="admin-clock" dateTime={now.toISOString()}>{clock}</time>
        <a className="admin-header-button button-icon button-icon-edit" href="/admin/settings">관리자정보 수정</a>
        <a className="admin-header-button button-icon button-icon-exit" href="/login" title="로그아웃" aria-label="관리자 로그아웃">로그아웃</a>
        <a className="admin-user-dashboard button-icon" href="/server-dashboard" aria-label="사용자 대시보드로 이동" title="사용자 대시보드로 이동" />
      </div>
    </header>
  );
}

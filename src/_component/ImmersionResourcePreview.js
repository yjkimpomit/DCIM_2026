"use client";

import { useState } from "react";
import ResourceMeterChart from "@/_component/ResourceMeterChart";

export default function ImmersionResourcePreview() {
  const [server, setServer] = useState(1);
  return (
    <section className="room-summary-section">
      <div className="room-card-heading"><h2 className="room-summary-title">서버 리소스 #{server}</h2><div className="room-cctv-controls"><button type="button" className="room-card-button button-icon button-icon-previous" disabled={server === 1} onClick={() => setServer(server - 1)} aria-label="이전 서버"></button><button type="button" className="room-card-button button-icon button-icon-next" disabled={server === 4} onClick={() => setServer(server + 1)} aria-label="다음 서버"></button></div></div>
      {/* server-monitoring의 CPU, 메모리, GPU(현재 0), 디스크 읽기+쓰기 항목 기준. 샘플 값만 표시. */}
      <div className="panel-card room-resource-list">
        <ResourceMeterChart label="CPU" value={75} color="usage" />
        <ResourceMeterChart label="GPU" value={0} color="usage" />
        <ResourceMeterChart label="메모리" value={52} color="usage" />
        <ResourceMeterChart label="디스크" value={42} color="usage" />
      </div>
    </section>
  );
}

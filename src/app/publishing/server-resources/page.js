"use client";

import { useState } from "react";
import RoomPublishingFrame, {
  RoomPageHeading,
} from "@/_component/RoomPublishingFrame";
import ResourceMeterChart from "@/_component/ResourceMeterChart";

const servers = Array.from({ length: 20 }, (_, index) => ({
  name: `SRV-${String(index + 1).padStart(3, "0")}`,
  address: `192.168.10.${101 + index}`,
  maintenance: index === 1 || index === 3,
}));

export default function ServerResourcesPublishing() {
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(servers.length / 10);

  return (
    <RoomPublishingFrame active="computing">
      <main className="room-viewer room-page-content">
        <RoomPageHeading title="컴퓨팅 리소스" />
        <div className="room-page-body room-computing-grid">
          <div className="room-detail-sidebar">
            <label className="visually-hidden" htmlFor="server-room">
              서버실 선택
            </label>
            <select
              className="form-select room-location-select"
              id="server-room"
              defaultValue="pomit"
            >
              <option value="pomit">포미트 서버실</option>
            </select>
            <section className="panel-card room-detail-card">
              <h3 className="room-panel-title">서버현황</h3>
              <dl className="room-server-counts room-server-counts-stacked">
                <div className="room-server-status room-server-normal">
                  <dt>정상</dt>
                  <dd>18대</dd>
                </div>
                <div className="room-server-status room-server-warning">
                  <dt>점검</dt>
                  <dd>2대</dd>
                </div>
              </dl>
            </section>
            <section className="panel-card room-detail-card">
              <h3 className="room-panel-title">사용현황</h3>
              <div className="room-usage-meters">
                <ResourceMeterChart
                  label="CPU 사용률(전체)"
                  value={75}
                  color="usage"
                />
                <ResourceMeterChart
                  label="GPU 사용률(전체)"
                  value={56}
                  color="usage"
                />
                <ResourceMeterChart
                  label="메모리 사용률(전체)"
                  value={52}
                  color="usage"
                />
                <ResourceMeterChart
                  label="디스크 사용률(전체)"
                  value={42}
                  color="usage"
                />
              </div>
            </section>
          </div>

          <section
            className="room-results"
            aria-labelledby="resource-results-title"
          >
            <h3
              className="room-panel-title room-results-title"
              id="resource-results-title"
            >
              조회결과 <small>({servers.length}건)</small>
            </h3>
            <div
              className="room-table-scroll"
              tabIndex={0}
              role="region"
              aria-label="서버별 컴퓨팅 리소스 목록"
            >
              <table className="room-table room-resource-table">
                <caption className="visually-hidden">
                  서버별 CPU, GPU, 메모리, 디스크 사용률과 상태
                </caption>
                <thead>
                  <tr>
                    <th scope="col">서버명</th>
                    <th scope="col">CPU</th>
                    <th scope="col">GPU</th>
                    <th scope="col">메모리</th>
                    <th scope="col">디스크</th>
                    <th scope="col">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {servers.slice((page - 1) * 10, page * 10).map((server) => (
                    <tr key={server.name}>
                      <th scope="row">
                        {server.name}({server.address})
                      </th>
                      <td>75%</td>
                      <td>56%</td>
                      <td>52%</td>
                      <td>42%</td>
                      <td>
                        <span
                          className={`badge badge-${server.maintenance ? "warning" : "primary"} badge-solid badge-md`}
                        >
                          {server.maintenance ? "점검" : "정상"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <nav className="room-pagination" aria-label="서버 목록 페이지">
              <button
                type="button"
                className="room-pagination-button"
                disabled={page === 1}
                onClick={() => setPage(1)}
                aria-label="첫 페이지"
              >
                FIRST
              </button>
              <button
                type="button"
                className="room-pagination-button"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                aria-label="이전 페이지"
              >
                PREV
              </button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                (number) => (
                  <button
                    type="button"
                    className="room-pagination-button"
                    key={number}
                    aria-current={page === number ? "page" : undefined}
                    aria-label={`${number}페이지`}
                    onClick={() => setPage(number)}
                  >
                    {number}
                  </button>
                ),
              )}
              <button
                type="button"
                className="room-pagination-button"
                disabled={page === pageCount}
                onClick={() => setPage(page + 1)}
                aria-label="다음 페이지"
              >
                NEXT
              </button>
              <button
                type="button"
                className="room-pagination-button"
                disabled={page === pageCount}
                onClick={() => setPage(pageCount)}
                aria-label="마지막 페이지"
              >
                LAST
              </button>
            </nav>
          </section>
        </div>
      </main>
    </RoomPublishingFrame>
  );
}

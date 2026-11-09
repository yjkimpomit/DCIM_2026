"use client";

import { useRef, useState } from "react";
import Pagination from "@/_component/Pagination";
import ConfirmDialog from "@/_component/ConfirmDialog";
import UserFrame from "@/_component/UserFrame";
import UserPageHeader from "@/_component/UserPageHeader";

// 퍼블리싱 확인용 샘플. 실제 알람 조회·해제·조치기록 저장 API와 연결하지 않는다.
const initialAlarms = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  occurredAt: "2026-08-28 14:02:05",
  name:
    index === 0
      ? "서버실 온도 임계값 초과(30°C 이상)"
      : index < 3
        ? "UPS 배터리 잔량 부족(20% 이하)"
        : "전력 사용량 임계값 초과",
  type: index === 0 ? "환경" : "전력",
  target: index === 1 ? "UPS" : index === 2 ? "Rack-12" : "서버실 01",
  severity: [0, 2, 5, 6].includes(index % 10) ? "danger" : "warning",
  resolved: index >= 5,
  duration: "00:04:32",
  record: "",
}));
const emptyFilters = { status: "", type: "", severity: "", period: "" };

export default function ServerAlarmsPublishing() {
  const [alarms, setAlarms] = useState(initialAlarms);
  const [filters, setFilters] = useState(emptyFilters);
  const [applied, setApplied] = useState(emptyFilters);
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState(1);
  const [record, setRecord] = useState("");
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const recordTriggerRef = useRef(null);
  const recordInputRef = useRef(null);
  const filtered = alarms.filter(
    (alarm) =>
      (!applied.status || String(alarm.resolved) === applied.status) &&
      (!applied.type || alarm.type === applied.type) &&
      (!applied.severity || alarm.severity === applied.severity) &&
      (!applied.period || alarm.occurredAt.startsWith(applied.period)),
  );

  const selected = alarms.find((alarm) => alarm.id === selectedId);
  const unresolvedCount = filtered.filter((alarm) => !alarm.resolved).length;

  function selectAlarm(alarm) {
    setSelectedId(alarm.id);
    setRecord(alarm.record);
    setEditing(false);
    setNotice("");
  }

  function applyFilters(event) {
    event.preventDefault();
    setApplied(filters);
    setPage(0);
  }

  function confirmAction() {
    if (confirmation === "release") {
      setAlarms((items) => items.map((alarm) => alarm.id === selectedId ? { ...alarm, resolved: true } : alarm));
      setNotice("알람이 해제되었습니다.");
    } else if (confirmation === "save") {
      setAlarms((items) => items.map((alarm) => alarm.id === selectedId ? { ...alarm, record } : alarm));
      setEditing(false);
      setNotice("조치기록이 저장되었습니다.");
    } else if (confirmation === "edit") {
      setRecord(selected.record);
      setEditing(true);
    }
    setConfirmation(null);
  }

  return (
    <UserFrame active="alarms">
      <main className="user-viewer user-page-content">
        <UserPageHeader title="알람" />
        <div className="user-page-body user-alarm-body">
          <form className="search-filters" onSubmit={applyFilters}>
            <label className="visually-hidden" htmlFor="alarm-status">
              알람 상태 선택
            </label>
            <select
              id="alarm-status"
              className="form-select"
              value={filters.status}
              onChange={(event) =>
                setFilters({ ...filters, status: event.target.value })
              }
            >
              <option value="">알람 상태 선택</option>
              <option value="false">미해결</option>
              <option value="true">해결</option>
            </select>
            <label className="visually-hidden" htmlFor="alarm-type">
              알람 유형 선택
            </label>
            <select
              id="alarm-type"
              className="form-select"
              value={filters.type}
              onChange={(event) =>
                setFilters({ ...filters, type: event.target.value })
              }
            >
              <option value="">알람 유형 선택</option>
              <option value="환경">환경</option>
              <option value="전력">전력</option>
            </select>
            <label className="visually-hidden" htmlFor="alarm-severity">
              심각도 선택
            </label>
            <select
              id="alarm-severity"
              className="form-select"
              value={filters.severity}
              onChange={(event) =>
                setFilters({ ...filters, severity: event.target.value })
              }
            >
              <option value="">심각도 선택</option>
              <option value="danger">위험</option>
              <option value="warning">점검</option>
            </select>
            <label className="visually-hidden" htmlFor="alarm-period">
              기간 선택
            </label>
            <select
              id="alarm-period"
              className="form-select"
              value={filters.period}
              onChange={(event) =>
                setFilters({ ...filters, period: event.target.value })
              }
            >
              <option value="">기간 선택</option>
              <option value="1">최근 1시간</option>
              <option value="2">최근 6시간</option>
              <option value="3">최근 12시간</option>
              <option value="4">최근 24시간</option>
            </select>
            <button type="submit" className="btn btn-primary btn-md btn-search">
              검색
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-md btn-filter-reset"
              onClick={() => {
                setFilters(emptyFilters);
                setApplied(emptyFilters);
                setPage(0);
              }}
            >
              필터 초기화
            </button>
          </form>

          <div className="user-alarm-layout">
            <section
              className="user-results user-alarm-results"
              aria-labelledby="alarm-results-title"
            >
              <div className="user-card-heading">
                <h3 className="user-panel-title" id="alarm-results-title">
                  조회결과 <small>({filtered.length}건)</small>
                </h3>
                <div className="user-alarm-counts">
                  <span className="user-alarm-unresolved">
                    • 미해결&nbsp; {unresolvedCount}건
                  </span>
                  <span className="user-alarm-resolved">
                    • 해결&nbsp; {filtered.length - unresolvedCount}건
                  </span>
                </div>
              </div>
              <div
                className="table-scroll user-table-scroll"
                tabIndex={0}
                role="region"
                aria-label="알람 조회 결과"
              >
                <table className="data-table user-table user-alarm-table">
                  <caption className="visually-hidden">
                    알람 발생시각, 알람명, 유형, 대상, 심각도, 지속시간, 상태
                  </caption>
                  <thead>
                    <tr className="data-table-row">
                      <th className="data-table-heading" scope="col">알람 발생시각</th>
                      <th className="data-table-heading" scope="col">알람명</th>
                      <th className="data-table-heading" scope="col">알람유형</th>
                      <th className="data-table-heading" scope="col">대상</th>
                      <th className="data-table-heading" scope="col">심각도</th>
                      <th className="data-table-heading" scope="col">지속시간</th>
                      <th className="data-table-heading" scope="col">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice(page * 10, (page + 1) * 10).map((alarm) => (
                      <tr
                        key={alarm.id}
                        className={`data-table-row ${(
                          selectedId === alarm.id ? "is-selected" : undefined
                        ) || ""}`}
                        onClick={() => selectAlarm(alarm)}
                      >
                        <td className="data-table-cell">{alarm.occurredAt}</td>
                        <td className="data-table-cell">
                          <button
                            type="button"
                            className="user-alarm-name"
                            aria-label={`${alarm.id}번 ${alarm.name} 상세 보기`}
                            onClick={() => selectAlarm(alarm)}
                          >
                            {alarm.name}
                          </button>
                        </td>
                        <td className="data-table-cell">{alarm.type}</td>
                        <td className="data-table-cell">{alarm.target}</td>
                        <td className="data-table-cell">
                          <span
                            className={`badge badge-${alarm.severity} badge-solid badge-md`}
                          >
                            {alarm.severity === "danger" ? "위험" : "점검"}
                          </span>
                        </td>
                        <td className="data-table-cell">{alarm.duration}</td>
                        <td className="data-table-cell">
                          <span
                            className={`badge badge-${alarm.resolved ? "resolved" : "unresolved"} badge-solid`}
                          >
                            {alarm.resolved ? "해결" : "미해결"}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {!filtered.length && (
                      <tr className="data-table-row">
                        <td className="data-table-cell" colSpan={7}>조회 결과가 없습니다.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination totalItems={filtered.length} pageSize={10} page={page} onChange={setPage} ariaLabel="알람 목록 페이지" />
            </section>

            <aside
              className="user-alarm-detail"
              aria-labelledby="alarm-detail-title"
            >
              <h3 className="user-panel-title user-alarm-detail-title" id="alarm-detail-title">
                알람 상세 정보
              </h3>
              <div className="user-alarm-detail-scroll">
                <section className="panel-card user-alarm-overview">
                  <h4 className="user-alarm-overview-title">
                    <span
                      className={`badge badge-${selected.severity} badge-solid`}
                    >
                      {selected.severity === "danger" ? "위험" : "점검"}
                    </span>
                    {selected.name}
                  </h4>
                  <dl className="user-alarm-values">
                    <div>
                      <dt>현재값</dt>
                      <dd>{selected.type === "환경" ? "36.2°C" : "18%"}</dd>
                    </div>
                    <div>
                      <dt>임계값</dt>
                      <dd>
                        {selected.type === "환경" ? "30.0°C 이상" : "20% 이하"}
                      </dd>
                    </div>
                    <div>
                      <dt>임계값 초과</dt>
                      <dd>{selected.type === "환경" ? "+6.2°C" : "-2%"}</dd>
                    </div>
                  </dl>
                </section>

                <section className="user-alarm-detail-section">
                  <h4 className="user-summary-title">발생정보</h4>
                  <dl className="panel-card user-alarm-info">
                    <div>
                      <dt>발생 시각</dt>
                      <dd>{selected.occurredAt}</dd>
                    </div>
                    <div>
                      <dt>지속 시간</dt>
                      <dd>{selected.duration}</dd>
                    </div>
                    <div>
                      <dt>알람 유형</dt>
                      <dd>{selected.type}</dd>
                    </div>
                    <div>
                      <dt>대상 설비</dt>
                      <dd>
                        {selected.type === "환경"
                          ? "CRAC-01(서버실)"
                          : selected.target}
                      </dd>
                    </div>
                  </dl>
                </section>

                <section className="user-alarm-detail-section">
                  <h4 className="user-summary-title">알람 내용</h4>
                  <p className="panel-card user-alarm-description">
                    {selected.type === "환경"
                      ? "서버실 온도가 설정된 임계값 30.0°C를 초과하였습니다."
                      : `${selected.name} 알람이 발생하였습니다.`}
                  </p>
                </section>

                <section className="user-alarm-detail-section">
                  <h4 className="user-summary-title">조치 방법</h4>
                  <p className="panel-card user-alarm-action">
                    {selected.type === "환경"
                      ? "냉방기 상태 확인 및 온도 조절 설정 점검 서버실 출입 제한 및 문 닫힘 확인"
                      : "해당 설비 상태와 전력 공급을 확인하고 장비 담당자에게 점검을 요청하세요."}
                  </p>
                </section>

                <section className="user-alarm-detail-section" hidden={editing}>
                  {/* 1. 기록이 없으면 안내 문구와 등록 버튼을 표시한다.
                      2. 기록이 있으면 저장된 내용과 수정 버튼을 표시한다.
                      등록·수정 중에는 조회 영역 전체를 hidden으로 숨기고 입력 영역만 표시한다. */}
                  <div className="user-card-heading user-alarm-record-heading">
                    <h4 className="user-summary-title">조치기록</h4>
                    <div className="user-alarm-record-actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        ref={recordTriggerRef}
                        hidden={editing}
                        aria-controls="alarm-record-editor"
                        aria-haspopup={selected.record.trim() ? "dialog" : undefined}
                        onClick={() => {
                          if (selected.record.trim()) {
                            setConfirmation("edit");
                            return;
                          }
                          setRecord(selected.record);
                          setEditing(true);
                        }}
                      >
                        {selected.record.trim() ? "수정" : "등록"}
                      </button>
                    </div>
                  </div>
                  <p className="panel-card user-alarm-description user-alarm-record-content">
                    {selected.record || "등록된 조치기록이 없습니다."}
                  </p>
                </section>

                {/* 3. 등록·수정 모드에서만 입력 영역과 제목 우측 저장·취소 버튼을 표시한다.
                    저장 시 조회 모드로 전환하고, 취소 시 기존 기록으로 복원한다. API 미연결 샘플. */}
                <section
                  id="alarm-record-editor"
                  className="user-alarm-detail-section"
                  hidden={!editing}
                >
                  <div className="user-card-heading user-alarm-record-heading">
                    <label
                      className="user-summary-title"
                      htmlFor="alarm-record"
                    >
                      조치기록 입력
                    </label>
                    <div
                      className="user-alarm-record-actions"
                      hidden={!editing}
                    >
                      <button
                        type="button"
                        className="btn btn-primary btn-xs"
                        aria-haspopup="dialog"
                        onClick={() => setConfirmation("save")}
                      >
                        저장
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-xs"
                        onClick={() => {
                          setRecord(selected.record);
                          setEditing(false);
                          setNotice("조치기록 입력을 취소했습니다.");
                        }}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                  <textarea
                    id="alarm-record"
                    ref={recordInputRef}
                    className="form-control user-alarm-record"
                    placeholder="조치 내용을 입력해 주세요."
                    value={record}
                    readOnly={!editing}
                    onChange={(event) => setRecord(event.target.value)}
                  />
                </section>
              </div>

              {/* 알람 해제 완료 상태에서는 알람해제 버튼에 hidden={selected.resolved}를 적용해 숨긴다. */}
              <div className="user-alarm-detail-footer">
                <p>
                  현재상태:{" "}
                  <span
                    className={
                      selected.resolved
                        ? "user-alarm-resolved"
                        : "user-alarm-unresolved"
                    }
                  >
                    {selected.resolved ? "해결" : "미해결"}
                  </span>
                </p>
                <button
                  type="button"
                  className="btn btn-danger btn-sm button-icon button-icon-release"
                  hidden={selected.resolved}
                  aria-haspopup="dialog"
                  onClick={() => setConfirmation("release")}
                >
                  알람해제
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <p className="visually-hidden" role="status">{notice}</p>
      {confirmation && <ConfirmDialog
        message={{ release: "알람 해제를 진행하시겠습니까?", save: "저장하시겠습니까?", edit: "수정하시겠습니까?" }[confirmation]}
        confirmLabel={{ release: "확인", save: "저장", edit: "수정" }[confirmation]}
        onConfirm={confirmAction}
        onCancel={() => setConfirmation(null)}
        fallbackFocusRef={confirmation === "edit" ? recordInputRef : recordTriggerRef}
      />}
    </UserFrame>
  );
}

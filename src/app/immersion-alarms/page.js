"use client";

import { useState } from "react";
import UserFrame from "@/_component/UserFrame";
import UserPageHeader from "@/_component/UserPageHeader";
import Pagination from "@/_component/Pagination";

// 시안 확인용 데이터. 실제 알람 조회 API 연결 시 교체한다.
const samples = [
	["danger", "#00", "AI Server", "DISK 사용량 경고"],
	["warning", "#01", "Rack Server", "GPU 자원 사용량 점검"],
	["danger", "#02", "GPU Server", "네트워크 연결 이상 감지"],
	["warning", "#03", "AI Server", "업데이트 필요"],
	["warning", "#04", "DB Server", "DB 응답 지연 감지"],
	["danger", "#00", "GPU Server", "GPU 온도 상승 경고"],
	["danger", "#01", "Network Switch", "네트워크 패킷 손실 감지"],
	["warning", "#02", "Storage Server", "스토리지 용량 점검 필요"],
	["warning", "#03", "Rack Server", "서버 전원 상태 점검"],
	["warning", "#04", "AI Server", "CPU 사용률 임계치 초과"],
];
const alarms = Array.from({ length: 50 }, (_, index) => {
	const [severity, tag, target, message] = samples[index % samples.length];
	return { id: index + 1, severity, tag, target, message, occurredAt: "2026-08-28 14:02:05" };
});
const emptyFilters = { severity: "", tag: "", target: "", message: "" };
const pageSize = 10;

export default function ImmersionAlarmsPublishing() {
	const [filters, setFilters] = useState(emptyFilters);
	const [applied, setApplied] = useState(emptyFilters);
	const [page, setPage] = useState(2);
	const filtered = alarms.filter((alarm) =>
		(!applied.severity || alarm.severity === applied.severity) &&
		(!applied.tag || alarm.tag === applied.tag) &&
		(!applied.target || alarm.target === applied.target) &&
		(!applied.message || alarm.message.toLocaleLowerCase().includes(applied.message.toLocaleLowerCase()))
	);

	function changeFilter(event) {
		const { name, value } = event.target;
		setFilters((previous) => ({ ...previous, [name]: value }));
	}

	return (
		<UserFrame active="immersion-alarms">
			<main className="user-viewer user-page-content">
				<UserPageHeader title="알람" section="IMMERSION COOLING MONITORING" homeHref="/immersion-dashboard" />
				<div className="user-page-body">
					<form
						className="search-filters immersion-alarm-filters"
						onSubmit={(event) => {
							event.preventDefault();
							setApplied({ ...filters, message: filters.message.trim() });
							setPage(0);
						}}
					>
						<label className="visually-hidden" htmlFor="immersion-alarm-severity">심각도 선택</label>
						<select id="immersion-alarm-severity" name="severity" className="form-select" value={filters.severity} onChange={changeFilter}>
							<option value="">심각도 선택</option>
							<option value="danger">위험</option>
							<option value="warning">점검</option>
						</select>
						<label className="visually-hidden" htmlFor="immersion-alarm-tag">TAG 선택</label>
						<select id="immersion-alarm-tag" name="tag" className="form-select" value={filters.tag} onChange={changeFilter}>
							<option value="">TAG 선택</option>
							{[...new Set(alarms.map((alarm) => alarm.tag))].map((tag) => (
								<option key={tag} value={tag}>{tag}</option>
							))}
						</select>
						<label className="visually-hidden" htmlFor="immersion-alarm-target">TAG Exp. 선택</label>
						<select id="immersion-alarm-target" name="target" className="form-select" value={filters.target} onChange={changeFilter}>
							<option value="">TAG Exp.</option>
							{[...new Set(alarms.map((alarm) => alarm.target))].map((target) => (
								<option key={target} value={target}>{target}</option>
							))}
						</select>
						<label className="visually-hidden" htmlFor="immersion-alarm-message">검색어 입력</label>
						<input id="immersion-alarm-message" name="message" className="form-control immersion-alarm-message" type="search" placeholder="검색어 입력" value={filters.message} onChange={changeFilter} />
						<button type="submit" className="btn btn-primary btn-md btn-search">검색</button>
						<button
							type="button"
							className="btn btn-secondary btn-md btn-filter-reset"
							onClick={() => {
								setFilters(emptyFilters);
								setApplied(emptyFilters);
								setPage(0);
							}}
						>필터 초기화</button>
					</form>

					<div className="table-scroll user-table-scroll immersion-alarm-results" tabIndex={-1} role="region" aria-label="액침냉각 알람 조회 결과">
						<table className="data-table user-table immersion-alarm-list-table">
							<caption className="visually-hidden">액침냉각 알람의 심각도, 발생시각, TAG, TAG 설명, 메시지</caption>
							<colgroup>
								<col className="immersion-alarm-column-severity" />
								<col className="immersion-alarm-column-time" />
								<col className="immersion-alarm-column-tag" />
								<col className="immersion-alarm-column-target" />
								<col />
							</colgroup>
							<thead>
								<tr className="data-table-row">
									<th className="data-table-heading" scope="col">심각도</th>
									<th className="data-table-heading" scope="col">알람 발생시각</th>
									<th className="data-table-heading" scope="col">TAG</th>
									<th className="data-table-heading" scope="col">TAG Exp.</th>
									<th className="data-table-heading" scope="col">메시지</th>
								</tr>
							</thead>
							<tbody>
								{filtered.slice(page * pageSize, (page + 1) * pageSize).map((alarm) => (
									<tr className="data-table-row" key={alarm.id}>
										<td className="data-table-cell">
											<span className={`badge badge-${alarm.severity} badge-solid badge-md`}>{alarm.severity === "danger" ? "위험" : "점검"}</span>
										</td>
										<td className="data-table-cell">
											<time dateTime={alarm.occurredAt.replace(" ", "T")}>{alarm.occurredAt}</time>
										</td>
										<td className="data-table-cell">{alarm.tag}</td>
										<td className="data-table-cell immersion-alarm-text">{alarm.target}</td>
										<td className="data-table-cell immersion-alarm-text">{alarm.message}</td>
									</tr>
								))}
								{!filtered.length && (
									<tr className="data-table-row">
										<td className="data-table-cell" colSpan={5}>조회 결과가 없습니다.</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					<Pagination ariaLabel="액침냉각 알람 목록 페이지" totalItems={filtered.length} pageSize={pageSize} page={page} onChange={setPage} />
					<p className="visually-hidden" role="status">조회 결과 {filtered.length}건, {page + 1}페이지</p>
				</div>
			</main>
		</UserFrame>
	);
}

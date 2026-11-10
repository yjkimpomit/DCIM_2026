"use client";

import { useState } from "react";
import Pagination from "@/_component/Pagination";
import ConfirmDialog from "@/_component/ConfirmDialog";
import AdminDialog from "@/_component/admin/AdminDialog";
import AdminPageHeader from "@/_component/admin/AdminPageHeader";
import { samplePolicies } from "@/_lib/admin/sampleData";

const emptyPolicy = { name: "", type: "환경", value1: "", value2: "", severity: "위험", methods: ["SMS"], enabled: true };

function PolicyForm({ policy, onSave, onClose }) {
	const [form, setForm] = useState(policy);
	const set = (name) => (event) => setForm({ ...form, [name]: event.target.value });
	const [error, setError] = useState("");
	const [pendingPolicy, setPendingPolicy] = useState(null);

	function submit(event) {
		event.preventDefault();
		if (!form.methods.length) {
			setError("알람 방법을 하나 이상 선택해 주세요.");
			return;
		}
		const values = { ...form, name: form.name.trim(), value1: form.value1.trim() };
		setPendingPolicy(values);
	}

	return <>
		<AdminDialog title={policy.id ? "정책 수정" : "정책 추가"} onClose={onClose}>
			<form onSubmit={submit}>
				<p className="admin-form-guide">알람 정책을 {policy.id ? "수정" : "추가"}할 수 있으며, <span className="form-field-required">*</span> 해당 표시가 되어 있는 항목은 필수 입력사항입니다.</p>
				<div className="admin-form-grid">
					<div className="form-field">
						<label className="form-label" htmlFor="alarms-field-1">정책명<span className="form-field-required" aria-hidden="true"> *</span></label>
						<input className="form-control" id="alarms-field-1" required value={form.name} onChange={set("name")} maxLength={100} pattern=".*\S.*" autoFocus />
					</div>
					<div className="form-field">
						<label className="form-label" htmlFor="alarms-field-2">알람표기<span className="form-field-required" aria-hidden="true"> *</span></label>
						<select className="form-control form-select" id="alarms-field-2" required value={form.severity} onChange={set("severity")}>
							<option value="위험">위험</option>
							<option value="점검">점검</option>
						</select>
					</div>
					<div className="form-field">
						<label className="form-label" htmlFor="alarms-field-3">알람유형<span className="form-field-required" aria-hidden="true"> *</span></label>
						<select className="form-control form-select" id="alarms-field-3" required value={form.type} onChange={set("type")}>
							<option value="환경">환경</option>
							<option value="장비">장비</option>
							<option value="전력">전력</option>
							<option value="보안">보안</option>
						</select>
					</div>
					<fieldset className="form-field"><legend className="form-label">알람방법 <span className="form-field-required">*</span></legend><div className="form-checkbox-group">{["SMS", "이메일"].map((method) => <label className="form-checkbox-label" key={method}><input className="form-check-input form-checkbox" type="checkbox" checked={form.methods.includes(method)} onChange={(event) => { setError(""); setForm({ ...form, methods: event.target.checked ? [...form.methods, method] : form.methods.filter((value) => value !== method) }); }} />{method}</label>)}</div></fieldset>
					<div className="form-field">
						<label className="form-label" htmlFor="alarms-field-4">설정값1<span className="form-field-required" aria-hidden="true"> *</span></label>
						<input className="form-control" id="alarms-field-4" required value={form.value1} onChange={set("value1")} pattern=".*\S.*" />
					</div>
					<div className="form-field">
						<label className="form-label" htmlFor="alarms-field-5">설정값2</label>
						<input className="form-control" id="alarms-field-5" value={form.value2} onChange={set("value2")} />
					</div>
				</div>
				<div className="admin-activation"><p className="form-label">활성화 여부 <span className="form-field-required">*</span></p><span className="form-switch"><input id="policy-enabled" className="switch" type="checkbox" role="switch" aria-label="정책 활성화 여부" checked={form.enabled} onChange={(event) => setForm({ ...form, enabled: event.target.checked })} /><label className="switch-label" htmlFor="policy-enabled"><span className="onoff-btn" /><span className="switch-state" aria-hidden="true" /></label></span></div>
				{error && <p className="form-error admin-form-error" role="alert">{error}</p>}
				<div className="form-actions">
					<button type="submit" className="btn btn-primary btn-lg">저장</button>
					<button type="button" className="btn btn-secondary btn-lg" onClick={onClose}>취소</button>
				</div>
			</form>
		</AdminDialog>
		{pendingPolicy && <ConfirmDialog
			message="저장하시겠습니까?"
			confirmLabel="저장"
			onConfirm={() => onSave(pendingPolicy)}
			onCancel={() => setPendingPolicy(null)}
		/>}
	</>;
}

export default function AlarmPoliciesPage() {
	const [policies, setPolicies] = useState(samplePolicies);
	const [query, setQuery] = useState({ name: "", type: "" });
	const [filter, setFilter] = useState(query);
	const [page, setPage] = useState(0);
	const [editing, setEditing] = useState(null);
	const [notice, setNotice] = useState("");
	const filtered = policies.filter((item) => item.name.includes(filter.name.trim()) && (!filter.type || item.type === filter.type));
	function save(policy) {
		const modified = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date());
		setPolicies((items) => policy.id ? items.map((item) => item.id === policy.id ? { ...policy, modified } : item) : [{ ...policy, id: Math.max(0, ...items.map((item) => item.id)) + 1, modified }, ...items]);
		setEditing(null); setNotice("정책이 저장되었습니다."); setPage(0);
	}
	return <>
		<AdminPageHeader title="알람 정책 관리" section="정보 관리" />
		<div className="admin-page-body">
			<form className="search-filters admin-search-layout" role="search" aria-label="알람 정책 검색" onSubmit={(event) => { event.preventDefault(); setFilter(query); setPage(0); }}>
				<input className="form-control" aria-label="정책명" placeholder="정책명 입력" value={query.name} onChange={(event) => setQuery({ ...query, name: event.target.value })} />
				<select className="form-select" aria-label="알람유형" value={query.type} onChange={(event) => setQuery({ ...query, type: event.target.value })}>
					<option value="">알람유형 전체</option>
					<option value="환경">환경</option>
					<option value="장비">장비</option>
					<option value="전력">전력</option>
					<option value="보안">보안</option>
				</select>
				<button className="btn btn-primary btn-md btn-search" type="submit">검색</button>
				<button className="btn btn-secondary btn-md btn-filter-reset" type="button" onClick={() => { setQuery({ name: "", type: "" }); setFilter({ name: "", type: "" }); setPage(0); }}>필터 초기화</button>
				<button className="btn btn-info btn-md button-icon button-icon-add admin-search-add" type="button" onClick={() => setEditing({ ...emptyPolicy })}>정책 추가</button>
			</form>
			<div className="table-scroll" role="region" aria-label="알람 정책 목록" tabIndex={-1}>
				<table className="data-table admin-table">
					<caption className="visually-hidden">알람 정책 목록</caption>
					<thead>
						<tr className="data-table-row">
							<th className="data-table-heading" scope="col">정책명</th>
							<th className="data-table-heading" scope="col">알람 유형</th>
							<th className="data-table-heading" scope="col">설정값</th>
							<th className="data-table-heading" scope="col">알람 표기</th>
							<th className="data-table-heading" scope="col">알람 방법</th>
							<th className="data-table-heading" scope="col">최종 수정</th>
							<th className="data-table-heading" scope="col">활성화</th>
							<th className="data-table-heading" scope="col">관리</th>
						</tr>
					</thead>
					<tbody>
						{filtered.slice(page * 10, page * 10 + 10).map((policy) => (
							<tr className="data-table-row" key={policy.id}>
								<td className="data-table-cell">{policy.name}</td>
								<td className="data-table-cell">{policy.type}</td>
								<td className="data-table-cell">{[policy.value1, policy.value2].filter(Boolean).join(" / ")}</td>
								<td className="data-table-cell">
									<span className={`badge badge-solid ${policy.severity === "위험" ? "badge-danger" : "badge-warning"}`}>{policy.severity}</span>
								</td>
								<td className="data-table-cell">{policy.methods.join(", ")}</td>
								<td className="data-table-cell">{policy.modified}</td>
								<td className="data-table-cell">
									<span className={`form-toggle-status${policy.enabled ? " is-on" : ""}`} role="img" aria-label={`${policy.name} 정책 활성화: ${policy.enabled ? "활성" : "비활성"}`}>
										<span className="switch-label">
											<span className="onoff-btn" />
											<span className="switch-state" aria-hidden="true" />
										</span>
									</span>
								</td>
								<td className="data-table-cell">
									<button className="btn btn-primary btn-sm admin-row-button" type="button" onClick={() => setEditing(policy)} aria-label={`${policy.name} 정책 수정`}>수정</button>
								</td>
							</tr>
						))}
						{!filtered.length && (
							<tr className="data-table-row">
								<td className="data-table-cell table-empty" colSpan={8}>검색 결과가 없습니다.</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<Pagination ariaLabel="알람 정책 목록 페이지" totalItems={filtered.length} pageSize={10} page={page} onChange={setPage} />
			<p className="visually-hidden" role="status">{notice}</p>
			{editing && <PolicyForm policy={editing} onSave={save} onClose={() => setEditing(null)} />}
		</div>
	</>;
}

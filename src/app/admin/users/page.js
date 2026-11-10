"use client";

import { useEffect, useRef, useState } from "react";
import Pagination from "@/_component/Pagination";
import AdminDialog, { AdminNotice } from "@/_component/admin/AdminDialog";
import AdminPageHeader from "@/_component/admin/AdminPageHeader";
import AddressSearchDialog from "@/_component/AddressSearchDialog";
import { sampleUsers } from "@/_lib/admin/sampleData";

export default function UsersPage() {
	const [users, setUsers] = useState(sampleUsers);
	const [query, setQuery] = useState({ username: "", email: "", role: "" });
	const [filter, setFilter] = useState(query);
	const [page, setPage] = useState(0);
	const [editing, setEditing] = useState(null);
	const [deleting, setDeleting] = useState(null);
	const [notice, setNotice] = useState("");
	const filtered = users.filter((user) => user.username.includes(filter.username.trim()) && user.email.includes(filter.email.trim()) && (!filter.role || user.role === filter.role));
	return <>
		<AdminPageHeader title="회원 목록" section="회원 관리" />
		<div className="admin-page-body">
			<form className="search-filters admin-search-layout" role="search" aria-label="회원 검색" onSubmit={(event) => { event.preventDefault(); setFilter(query); setPage(0); }}>
				<input className="form-control" aria-label="사용자 아이디" placeholder="아이디 입력" value={query.username} onChange={(event) => setQuery({ ...query, username: event.target.value })} />
				<input className="form-control" aria-label="이메일" placeholder="이메일 입력" value={query.email} onChange={(event) => setQuery({ ...query, email: event.target.value })} />
				<select className="form-select" aria-label="권한" value={query.role} onChange={(event) => setQuery({ ...query, role: event.target.value })}>
					<option value="">권한 전체</option>
					<option value="관리자">관리자</option>
					<option value="일반">일반</option>
					<option value="승인">승인</option>
				</select>
				<button className="btn btn-primary btn-md btn-search" type="submit">검색</button>
				<button className="btn btn-secondary btn-md btn-filter-reset" type="button" onClick={() => { const empty = { username: "", email: "", role: "" }; setQuery(empty); setFilter(empty); setPage(0); }}>필터 초기화</button>
			</form>
			<div className="table-scroll" role="region" aria-label="회원 목록" tabIndex={-1}>
				<table className="data-table admin-table">
					<caption className="visually-hidden">회원 목록</caption>
					<thead>
						<tr className="data-table-row">
							<th className="data-table-heading" scope="col">번호</th>
							<th className="data-table-heading" scope="col">사용자 ID</th>
							<th className="data-table-heading" scope="col">EMAIL</th>
							<th className="data-table-heading" scope="col">이름</th>
							<th className="data-table-heading" scope="col">휴대전화</th>
							<th className="data-table-heading" scope="col">권한</th>
							<th className="data-table-heading" scope="col">관리</th>
						</tr>
					</thead>
					<tbody>
						{filtered.slice(page * 10, page * 10 + 10).map((user, index) => (
							<tr className="data-table-row" key={user.id}>
								<td className="data-table-cell">{page * 10 + index + 1}</td>
								<td className="data-table-cell">{user.username}</td>
								<td className="data-table-cell">{user.email}</td>
								<td className="data-table-cell">{user.name}</td>
								<td className="data-table-cell">{user.mobile}</td>
								<td className="data-table-cell">{user.role}</td>
								<td className="data-table-cell">
									<div className="admin-row-actions">
										<button type="button" className="btn btn-primary btn-sm admin-row-button" onClick={() => setEditing(user)} aria-label={user.name + " 회원 조회"}>조회</button>
										<button type="button" className="btn btn-danger btn-sm admin-row-button" onClick={() => setDeleting(user)} aria-label={user.name + " 회원 삭제"}>삭제</button>
									</div>
								</td>
							</tr>
						))}
						{!filtered.length && (
							<tr className="data-table-row">
								<td className="data-table-cell table-empty" colSpan={7}>검색 결과가 없습니다.</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<Pagination ariaLabel="회원 목록 페이지" totalItems={filtered.length} pageSize={10} page={page} onChange={setPage} />
			{editing && (
				<AdminDialog title="사용자 정보" onClose={() => setEditing(null)}>
					<UserInformationForm user={editing} onCancel={() => setEditing(null)} onSave={(user) => {
						setUsers((items) => items.map((item) => item.id === user.id ? user : item));
						setEditing(null);
						setPage(0);
						setNotice("사용자 정보가 저장되었습니다.");
					}} />
				</AdminDialog>
			)}
			{deleting && <AdminDialog title="회원 삭제" compact onClose={() => setDeleting(null)}><p className="admin-notice-message">{deleting.username} 회원을 삭제하시겠습니까?</p><div className="form-actions"><button className="btn btn-danger" type="button" onClick={() => { setUsers((items) => items.filter((item) => item.id !== deleting.id)); setDeleting(null); setPage(0); setNotice("회원이 삭제되었습니다."); }}>삭제</button><button className="btn btn-secondary" type="button" onClick={() => setDeleting(null)}>취소</button></div></AdminDialog>}
			{notice && <AdminNotice onClose={() => setNotice("")}>{notice}</AdminNotice>}
		</div>
	</>;
}

function UserInformationForm({ user, onSave, onCancel }) {
	const [form, setForm] = useState(user);
	const [addressSearchOpen, setAddressSearchOpen] = useState(false);
	const detailAddressRef = useRef(null);
	const focusDetailAddress = useRef(false);
	useEffect(() => {
		if (!addressSearchOpen && focusDetailAddress.current) {
			focusDetailAddress.current = false;
			detailAddressRef.current?.focus();
		}
	}, [addressSearchOpen]);

	const [message, setMessage] = useState("");
	const update = (values) => setForm((current) => ({ ...current, ...values }));
	const set = (name) => (event) => update({ [name]: event.target.value });

	return <>
		<form className="admin-user-form" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
			<div className="admin-form-grid">
				<div className="form-field">
					<label className="form-label" htmlFor="users-field-1">사용자 아이디<span className="form-field-required" aria-hidden="true"> *</span></label>
					<input className="form-control" id="users-field-1" required value={form.username} readOnly autoComplete="username" />
				</div>
				<div className="form-field">
					<span className="form-label">비밀번호 <span className="form-field-required">*</span></span>
					<div className="admin-inline-field">
						<input className="form-control" aria-label="비밀번호" type="password" value="*****" readOnly />
						<button className="btn btn-primary btn-lg" type="button" onClick={() => setMessage("비밀번호가 초기화 되었습니다. 초기화된 비밀번호는 12345입니다.")}>
							초기화
						</button>
					</div>
					<p className="form-field-help">초기화 시 비밀번호는 12345로 설정됩니다.</p>
				</div>
				<div className="form-field">
					<label className="form-label" htmlFor="users-field-2">권한<span className="form-field-required" aria-hidden="true"> *</span></label>
					<select className="form-control form-select" id="users-field-2" required value={form.role} onChange={set("role")}>
						<option value="관리자">관리자</option>
						<option value="일반">일반</option>
						<option value="승인">승인</option>
					</select>
				</div>
				<div className="form-field">
					<label className="form-label" htmlFor="users-field-3">이름<span className="form-field-required" aria-hidden="true"> *</span></label>
					<input className="form-control" id="users-field-3" required value={form.name} onChange={set("name")} />
				</div>
				<div className="form-field">
					<label className="form-label" htmlFor="users-field-4">생년월일</label>
					<input className="form-control" id="users-field-4" type="date" value={form.birth} onChange={set("birth")} />
				</div>
				<div className="form-field">
					<label className="form-label" htmlFor="users-field-5">이메일<span className="form-field-required" aria-hidden="true"> *</span></label>
					<input className="form-control" id="users-field-5" type="email" required value={form.email} onChange={set("email")} />
				</div>
				<div className="form-field">
					<label className="form-label" htmlFor="users-field-6">전화번호</label>
					<input className="form-control" id="users-field-6" type="tel" value={form.telephone} onChange={set("telephone")} />
				</div>
				<div className="form-field">
					<label className="form-label" htmlFor="users-field-7">휴대전화<span className="form-field-required" aria-hidden="true"> *</span></label>
					<input className="form-control" id="users-field-7" type="tel" required value={form.mobile} onChange={set("mobile")} />
				</div>
				<div className="form-field form-field-full">
					<span className="form-label">주소</span>
					<div className="admin-address-fields">
						<div className="admin-inline-field admin-postcode-field">
							<input className="form-control" aria-label="우편번호" value={form.postcode} onChange={set("postcode")} />
							<button className="btn btn-primary btn-lg" type="button" aria-haspopup="dialog" onClick={() => setAddressSearchOpen(true)}>주소 검색</button>
						</div>
						<input className="form-control" aria-label="기본 주소" value={form.address} onChange={set("address")} />
						<input className="form-control" ref={detailAddressRef} aria-label="상세 주소" value={form.detailAddress} onChange={set("detailAddress")} />
					</div>
				</div>
			</div>
			<div className="form-actions">
				<button type="submit" className="btn btn-primary btn-lg">저장</button>
				<button type="button" className="btn btn-secondary btn-lg" onClick={() => { setForm(user); onCancel(); }}>취소</button>
			</div>
		</form>
		{addressSearchOpen && <AddressSearchDialog onClose={() => setAddressSearchOpen(false)} onSelect={(address) => { focusDetailAddress.current = true; update({ ...address, detailAddress: "" }); setAddressSearchOpen(false); }} />}
		{message && <AdminNotice onClose={() => setMessage("")}>{message}</AdminNotice>}
	</>;
}

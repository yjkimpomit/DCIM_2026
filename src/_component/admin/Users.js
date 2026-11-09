"use client";

import { useState } from "react";
import Pagination from "@/_component/Pagination";
import AdminDialog, { AdminNotice } from "./AdminDialog";
import UserInformationForm from "./UserInformationForm";
import { sampleUsers } from "@/_lib/admin/sampleData";

export default function Users() {
  const [users, setUsers] = useState(sampleUsers);
  const [query, setQuery] = useState({ username: "", email: "", role: "" });
  const [filter, setFilter] = useState(query);
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [notice, setNotice] = useState("");
  const filtered = users.filter((user) => user.username.includes(filter.username.trim()) && user.email.includes(filter.email.trim()) && (!filter.role || user.role === filter.role));
  return <div className="admin-page-body">
    <form className="search-filters admin-search-layout" role="search" aria-label="회원 검색" onSubmit={(event) => { event.preventDefault(); setFilter(query); setPage(0); }}>
      <input className="form-control" aria-label="사용자 아이디" placeholder="아이디 입력" value={query.username} onChange={(event) => setQuery({ ...query, username: event.target.value })} />
      <input className="form-control" aria-label="이메일" placeholder="이메일 입력" value={query.email} onChange={(event) => setQuery({ ...query, email: event.target.value })} />
      <select className="form-select" aria-label="권한" value={query.role} onChange={(event) => setQuery({ ...query, role: event.target.value })}><option value="">권한 전체</option>{["관리자", "일반", "승인"].map((role) => <option key={role}>{role}</option>)}</select>
      <button className="btn btn-primary btn-md btn-search" type="submit">검색</button><button className="btn btn-secondary btn-md btn-filter-reset" type="button" onClick={() => { const empty = { username: "", email: "", role: "" }; setQuery(empty); setFilter(empty); setPage(0); }}>필터 초기화</button>
    </form>
    <div className="table-scroll" role="region" aria-label="회원 목록" tabIndex={0}><table className="data-table admin-table"><caption className="visually-hidden">회원 목록</caption><thead><tr className="data-table-row">{["번호", "사용자 ID", "EMAIL", "이름", "휴대전화", "권한", "관리"].map((title) => <th className="data-table-heading" scope="col" key={title}>{title}</th>)}</tr></thead><tbody>{filtered.slice(page * 10, page * 10 + 10).map((user, index) => <tr className="data-table-row" key={user.id}><td className="data-table-cell">{page * 10 + index + 1}</td><td className="data-table-cell">{user.username}</td><td className="data-table-cell">{user.email}</td><td className="data-table-cell">{user.name}</td><td className="data-table-cell">{user.mobile}</td><td className="data-table-cell">{user.role}</td><td className="data-table-cell"><div className="admin-row-actions"><button type="button" className="btn btn-primary btn-sm admin-row-button" onClick={() => setEditing(user)} aria-label={`${user.name} 회원 조회`}>조회</button><button type="button" className="btn btn-danger btn-sm admin-row-button" onClick={() => setDeleting(user)} aria-label={`${user.name} 회원 삭제`}>삭제</button></div></td></tr>)}{!filtered.length && <tr className="data-table-row"><td className="data-table-cell table-empty" colSpan={7}>검색 결과가 없습니다.</td></tr>}</tbody></table></div>
    <Pagination ariaLabel="회원 목록 페이지" totalItems={filtered.length} pageSize={10} page={page} onChange={setPage} />
    {editing && <AdminDialog title="사용자 정보" onClose={() => setEditing(null)}><UserInformationForm user={editing} onCancel={() => setEditing(null)} onSave={(user) => { setUsers((items) => items.map((item) => item.id === user.id ? user : item)); setEditing(null); setPage(0); setNotice("사용자 정보가 저장되었습니다."); }} /></AdminDialog>}
    {deleting && <AdminDialog title="회원 삭제" compact onClose={() => setDeleting(null)}><p className="admin-notice-message">{deleting.username} 회원을 삭제하시겠습니까?</p><div className="form-actions"><button className="btn btn-danger" type="button" onClick={() => { setUsers((items) => items.filter((item) => item.id !== deleting.id)); setDeleting(null); setPage(0); setNotice("회원이 삭제되었습니다."); }}>삭제</button><button className="btn btn-secondary" type="button" onClick={() => setDeleting(null)}>취소</button></div></AdminDialog>}
    {notice && <AdminNotice onClose={() => setNotice("")}>{notice}</AdminNotice>}
  </div>;
}



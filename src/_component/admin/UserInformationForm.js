"use client";

import { useEffect, useRef, useState } from "react";
import AdminDialog, { AdminNotice } from "./AdminDialog";
import { Field, SelectField, FormActions } from "@/_component/FormFields";
import AddressSearchDialog from "./AddressSearchDialog";
import PasswordHelp from "@/_component/PasswordHelp";
import { passwordRules, validatePassword } from "@/_lib/password";

function PasswordDialog({ username, mobile, onClose, onComplete }) {
  const [error, setError] = useState("");
  function submit(event) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const password = values.get("nextPassword");
    const validationError = validatePassword({ password, confirmation: values.get("confirmPassword"), currentPassword: values.get("currentPassword"), username, mobile });
    if (validationError) { setError(validationError); return; }
    onComplete();
  }
  return <AdminDialog title="비밀번호 변경" onClose={onClose}><form onSubmit={submit}>
    <div className="admin-form-stack">
      <Field label="기존 비밀번호" name="currentPassword" type="password" autoComplete="current-password" required autoFocus />
      <Field label="변경 비밀번호" name="nextPassword" type="password" autoComplete="new-password" required {...passwordRules} aria-describedby="admin-password-help" />
      <Field label="비밀번호 확인" name="confirmPassword" type="password" autoComplete="new-password" required minLength={passwordRules.minLength} maxLength={passwordRules.maxLength} />
    </div>
    <PasswordHelp id="admin-password-help" className="admin-password-help" />
    {error && <p className="form-error admin-form-error" role="alert">{error}</p>}
    <FormActions submitLabel="비밀번호 변경" onCancel={onClose} />
  </form></AdminDialog>;
}

export default function UserInformationForm({ user, profile = false, onSave, onCancel }) {
  const detailAddressRef = useRef(null);
  const focusDetailAddress = useRef(false);
  const [form, setForm] = useState(user);
  const [overlay, setOverlay] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (overlay === null && focusDetailAddress.current) {
      focusDetailAddress.current = false;
      detailAddressRef.current?.focus();
    }
  }, [overlay]);
  const set = (name) => (event) => setForm({ ...form, [name]: event.target.value });
  return <>
    <form className={profile ? "admin-profile-form" : "admin-user-form"} onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
      {profile && <p className="admin-form-guide"><span className="form-field-required">*</span> 해당 표시가 되어 있는 항목은 필수 입력사항입니다.</p>}
      <div className="admin-form-grid">
        <Field label={profile ? "아이디" : "사용자 아이디"} required value={form.username} readOnly autoComplete="username" />
        {profile ? <Field label="이름" required value={form.name} onChange={set("name")} /> : <div className="form-field"><span className="form-label">비밀번호 <span className="form-field-required">*</span></span><div className="admin-inline-field"><input className="form-control" aria-label="비밀번호" type="password" value="*****" readOnly /><button className="btn btn-primary btn-lg" type="button" onClick={() => setMessage("비밀번호가 초기화 되었습니다. 초기화된 비밀번호는 12345입니다.")}>초기화</button></div><p className="form-field-help">초기화 시 비밀번호는 12345로 설정됩니다.</p></div>}
        {profile ? <div className="form-field form-field-full"><span className="form-label">비밀번호 <span className="form-field-required">*</span></span><div className="admin-inline-field admin-password-field"><input className="form-control" aria-label="비밀번호" type="password" value="*****" readOnly /><button className="btn btn-primary btn-lg" type="button" onClick={() => setOverlay("password")}>비밀번호 변경</button></div></div> : <><SelectField label="권한" options={["관리자", "일반", "승인"]} required value={form.role} onChange={set("role")} /><Field label="이름" required value={form.name} onChange={set("name")} /></>}
        {profile ? <><Field label="이메일" type="email" required value={form.email} onChange={set("email")} /><Field label="휴대전화" type="tel" required value={form.mobile} onChange={set("mobile")} /><Field label="생년월일" type="date" value={form.birth} onChange={set("birth")} /><Field label="전화번호" type="tel" value={form.telephone} onChange={set("telephone")} /></> : <><Field label="생년월일" type="date" value={form.birth} onChange={set("birth")} /><Field label="이메일" type="email" required value={form.email} onChange={set("email")} /><Field label="전화번호" type="tel" value={form.telephone} onChange={set("telephone")} /><Field label="휴대전화" type="tel" required value={form.mobile} onChange={set("mobile")} /></>}
        <div className="form-field form-field-full"><span className="form-label">주소</span><div className="admin-address-fields"><div className="admin-inline-field admin-postcode-field"><input className="form-control" aria-label="우편번호" value={form.postcode} onChange={set("postcode")} /><button className="btn btn-primary btn-lg" type="button" onClick={() => setOverlay("address")}>주소 검색</button></div><input className="form-control" aria-label="기본 주소" value={form.address} onChange={set("address")} /><input className="form-control" ref={detailAddressRef} aria-label="상세 주소" value={form.detailAddress} onChange={set("detailAddress")} /></div></div>
      </div>
      <FormActions onCancel={() => { setForm(user); onCancel?.(); }} />
    </form>
    {overlay === "password" && <PasswordDialog username={form.username} mobile={form.mobile} onClose={() => setOverlay(null)} onComplete={() => { setOverlay(null); setMessage("비밀번호가 변경되었습니다."); }} />}
    {overlay === "address" && <AddressSearchDialog onClose={() => setOverlay(null)} onSelect={(address) => { focusDetailAddress.current = true; setForm((current) => ({ ...current, ...address, detailAddress: "" })); setOverlay(null); }} />}
    {message && <AdminNotice onClose={() => setMessage("")}>{message}</AdminNotice>}
  </>;
}

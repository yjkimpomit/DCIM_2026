"use client";

import { useEffect, useRef, useState } from "react";
import AdminPageHeader from "@/_component/admin/AdminPageHeader";
import AdminDialog, { AdminNotice } from "@/_component/admin/AdminDialog";
import PasswordHelp from "@/_component/PasswordHelp";
import { passwordRules, validatePassword } from "@/_lib/password";
import AddressSearchDialog from "@/_component/AddressSearchDialog";
import { sampleProfile } from "@/_lib/admin/sampleData";

export default function SettingsPage() {
	const [profile, setProfile] = useState(sampleProfile);
	const [notice, setNotice] = useState(false);

	function saveProfile(form) {
		setProfile(form);
		setNotice(true);
	}

	return (
		<>
			<AdminPageHeader title="관리자정보 수정" />
			<div className="admin-page-body">
				<AdminProfileForm user={profile} onSave={saveProfile} />
				{notice && (
					<AdminNotice onClose={() => setNotice(false)}>
						관리자 정보가 저장되었습니다.
					</AdminNotice>
				)}
			</div>
		</>
	);
}

function AdminProfileForm({ user, onSave }) {
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
	const [overlay, setOverlay] = useState(null);
	return <>
		<form className="admin-profile-form" onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
			<p className="form-guide"><span className="form-field-required">*</span> 해당 표시가 되어 있는 항목은 필수 입력사항입니다.</p>
			<div className="form-grid form-grid-two">
				<div className="form-field">
					<label className="form-label" htmlFor="settings-field-1">아이디<span className="form-field-required" aria-hidden="true"> *</span></label>
					<input className="form-control" id="settings-field-1" required value={form.username} readOnly autoComplete="username" />
				</div>
				<div className="form-field">
					<label className="form-label" htmlFor="settings-field-2">이름<span className="form-field-required" aria-hidden="true"> *</span></label>
					<input className="form-control" id="settings-field-2" required value={form.name} onChange={set("name")} />
				</div>
				<div className="form-field form-field-full">
					<span className="form-label">비밀번호 <span className="form-field-required">*</span></span>
					<div className="form-inline form-password">
						<input className="form-control" aria-label="비밀번호" type="password" value="*****" readOnly />
						<button className="btn btn-primary btn-lg" type="button" onClick={() => setOverlay("password")}>비밀번호 변경</button>
					</div>
				</div>
				<div className="form-field">
					<label className="form-label" htmlFor="settings-field-3">이메일<span className="form-field-required" aria-hidden="true"> *</span></label>
					<input className="form-control" id="settings-field-3" type="email" required value={form.email} onChange={set("email")} />
				</div>
				<div className="form-field">
					<label className="form-label" htmlFor="settings-field-4">휴대전화<span className="form-field-required" aria-hidden="true"> *</span></label>
					<input className="form-control" id="settings-field-4" type="tel" required value={form.mobile} onChange={set("mobile")} />
				</div>
				<div className="form-field">
					<label className="form-label" htmlFor="settings-field-5">생년월일</label>
					<input className="form-control" id="settings-field-5" type="date" value={form.birth} onChange={set("birth")} />
				</div>
				<div className="form-field">
					<label className="form-label" htmlFor="settings-field-6">전화번호</label>
					<input className="form-control" id="settings-field-6" type="tel" value={form.telephone} onChange={set("telephone")} />
				</div>
				<div className="form-field form-field-full">
					<span className="form-label">주소</span>
					<div className="form-address">
						<div className="form-inline form-postcode">
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
				<button type="button" className="btn btn-secondary btn-lg" onClick={() => setForm(user)}>취소</button>
			</div>
		</form>
		{addressSearchOpen && <AddressSearchDialog onClose={() => setAddressSearchOpen(false)} onSelect={(address) => { focusDetailAddress.current = true; update({ ...address, detailAddress: "" }); setAddressSearchOpen(false); }} />}
		{overlay === "password" && <PasswordDialog username={form.username} mobile={form.mobile} onClose={() => setOverlay(null)} onComplete={() => { setOverlay(null); setMessage("비밀번호가 변경되었습니다."); }} />}
		{message && <AdminNotice onClose={() => setMessage("")}>{message}</AdminNotice>}
	</>;
}

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
	return <AdminDialog title="비밀번호 변경" onClose={onClose}>
		<form onSubmit={submit}>
			<div className="form-grid">
				<div className="form-field">
					<label className="form-label" htmlFor="settings-field-7">기존 비밀번호<span className="form-field-required" aria-hidden="true"> *</span></label>
					<input className="form-control" id="settings-field-7" name="currentPassword" type="password" autoComplete="current-password" required autoFocus />
				</div>
				<div className="form-field">
					<label className="form-label" htmlFor="settings-field-8">변경 비밀번호<span className="form-field-required" aria-hidden="true"> *</span></label>
					<input className="form-control" id="settings-field-8" name="nextPassword" type="password" autoComplete="new-password" required {...passwordRules} aria-describedby="admin-password-help" />
				</div>
				<div className="form-field">
					<label className="form-label" htmlFor="settings-field-9">비밀번호 확인<span className="form-field-required" aria-hidden="true"> *</span></label>
					<input className="form-control" id="settings-field-9" name="confirmPassword" type="password" autoComplete="new-password" required minLength={passwordRules.minLength} maxLength={passwordRules.maxLength} />
				</div>
			</div>
			<PasswordHelp id="admin-password-help" className="admin-password-help" />
			{error && <p className="form-error" role="alert">{error}</p>}
			<div className="form-actions">
				<button type="submit" className="btn btn-primary btn-lg">비밀번호 변경</button>
				<button type="button" className="btn btn-secondary btn-lg" onClick={onClose}>취소</button>
			</div>
		</form>
	</AdminDialog>;
}

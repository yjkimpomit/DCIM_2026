"use client";

import { useEffect, useRef, useState } from "react";
import PasswordHelp from "@/_component/PasswordHelp";
import Modal from "@/_component/Modal";
import { passwordRules, validatePassword } from "@/_lib/password";

export default function AccountRecovery({ mode, onClose }) {
	const dialogRef = useRef(null);
	const [step, setStep] = useState("input");
	const [accountId, setAccountId] = useState("");
	const [phone, setPhone] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmation, setConfirmation] = useState("");
	const [error, setError] = useState("");
	const isId = mode === "id";
	const isResult = step === "result";
	const title = isId ? "아이디 찾기" : "비밀번호 찾기";
	const description = !isResult
		? "해당 정보를 입력해 주세요."
		: isId ? "아이디를 찾았어요." : "비밀번호를 재설정 하세요.";

	useEffect(() => {
		const target = dialogRef.current.querySelector(isResult && isId ? "#recovery-title" : "input");
		target?.focus();
	}, [step, isId, isResult]);

	function goBack() {
		if (isResult) {
			setStep("input");
			setPassword("");
			setConfirmation("");
			setError("");
		} else {
			onClose();
		}
	}

	function submit(event) {
		event.preventDefault();
		if (!isResult) {
			setStep("result");
			return;
		}
		const validationError = validatePassword({ password, confirmation, username: accountId, mobile: phone });
		if (validationError) {
			setError(validationError);
			return;
		}
		onClose();
	}

	return (
		<Modal
			dialogRef={dialogRef}
			className="account-dialog"
			aria-labelledby="recovery-title"
			aria-describedby="recovery-description"
			onClose={onClose}
		>
			<button type="button" className="account-back button-icon button-icon-previous" onClick={goBack}>
				돌아가기
			</button>

			<h2 className="logo">
				<img src="/images/pomit_white_h.svg" alt="POMIT" style={{ height: "36px" }} width={100} height={36} /> <span>DCIM</span>
			</h2>

			<div className="login-form">
				<div className="account-heading">
					<h3 id="recovery-title" className="form-title" tabIndex={-1}>{title}</h3>
					<p id="recovery-description" className="account-description">{description}</p>
				</div>

				{isId && isResult ? (
					<div className="form-box">
						<div className="account-result" role="status">
							아이디는 external_user 입니다.
						</div>
						<div className="account-actions">
							<button type="button" className="btn btn-secondary btn-lg" onClick={() => {
								onClose("password");
							}}>비밀번호 찾기</button>
							<button type="button" className="btn btn-primary btn-lg" onClick={() => onClose()}>로그인으로 이동</button>
						</div>
					</div>
				) : (
					<form className="form-box" onSubmit={submit}>
						{!isResult ? (
							<>
								{!isId && (
									<div className="form-item">
										<label htmlFor="recovery-id" className="form-label">아이디 <span className="required" aria-hidden="true">*</span></label>
										<input id="recovery-id" className="form-control" autoComplete="username" value={accountId} onChange={(event) => setAccountId(event.target.value)} required />
									</div>
								)}
								<div className="form-item">
									<label htmlFor="recovery-phone" className="form-label">휴대전화 <span className="required" aria-hidden="true">*</span></label>
									<input id="recovery-phone" className="form-control" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required />
								</div>
								<div className="form-item">
									<label htmlFor="recovery-name" className="form-label">이름 <span className="required" aria-hidden="true">*</span></label>
									<input id="recovery-name" className="form-control" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required />
								</div>
								<button type="submit" className="btn btn-primary btn-lg btn-login" disabled={!phone.trim() || !name.trim() || (!isId && !accountId.trim())}>다음</button>
							</>
						) : (
							<>
								<div className="form-item">
									<label htmlFor="recovery-password" className="form-label">변경 비밀번호 <span className="required" aria-hidden="true">*</span></label>
									<input id="recovery-password" className="form-control" type="password" autoComplete="new-password" {...passwordRules} aria-describedby="recovery-password-help" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} required />
								</div>
								<div className="form-item">
									<label htmlFor="recovery-confirmation" className="form-label">비밀번호 확인 <span className="required" aria-hidden="true">*</span></label>
									<input id="recovery-confirmation" className="form-control" type="password" autoComplete="new-password" minLength={passwordRules.minLength} maxLength={passwordRules.maxLength} aria-invalid={error ? true : undefined} aria-describedby={error ? "recovery-error" : undefined} value={confirmation} onChange={(event) => { setConfirmation(event.target.value); setError(""); }} required />
								</div>
								<PasswordHelp id="recovery-password-help" />
								{error && <p id="recovery-error" className="form-error" role="alert">{error}</p>}
								<button type="submit" className="btn btn-primary btn-lg btn-login" disabled={!password || !confirmation}>비밀번호 변경</button>
							</>
						)}
					</form>
				)}
			</div>
		</Modal>
	);
}

"use client";

import { useEffect, useRef, useState } from "react";

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
    const trigger = document.activeElement;
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => {
      dialog.close();
      trigger?.focus();
    };
  }, []);

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
    if (password !== confirmation) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (password.includes(accountId.trim()) || password.includes(phone.replace(/\D/g, ""))) {
      setError("아이디와 휴대전화 번호를 포함하지 않는 비밀번호를 입력해 주세요.");
      return;
    }
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="account-dialog"
      aria-labelledby="recovery-title"
      aria-describedby="recovery-description"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
    >
      <button type="button" className="account-back button-icon button-icon-previous" onClick={goBack}>
        돌아가기
      </button>

      <h2 className="logo">
        <img src="/images/pomit_white_h.svg" alt="POMIT" style={{height: "36px"}} width={100} height={36}/> <span>DCIM</span>
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
                  <input id="recovery-password" className="form-control" type="password" autoComplete="new-password" minLength={8} maxLength={15} pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,15}" title="8~15자, 영문 대문자·소문자·숫자·특수문자 포함" aria-describedby="recovery-password-help" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} required />
                </div>
                <div className="form-item">
                  <label htmlFor="recovery-confirmation" className="form-label">비밀번호 확인 <span className="required" aria-hidden="true">*</span></label>
                  <input id="recovery-confirmation" className="form-control" type="password" autoComplete="new-password" minLength={8} maxLength={15} aria-invalid={error ? true : undefined} aria-describedby={error ? "recovery-error" : undefined} value={confirmation} onChange={(event) => { setConfirmation(event.target.value); setError(""); }} required />
                </div>
                <div id="recovery-password-help" className="account-help">
                  <span className="account-help-icon" aria-hidden="true"></span>
                  <div className="account-help-content">
                    <p>입력자리 수 제한: 최소 8 / 최대 15</p>
                    <p>필수 입력 값: 영문대문자, 영문소문자, 숫자, 특수문자</p>
                    <p>입력 제한 값: 아이디, 휴대전화</p>
                    <p className="account-help-warning">여러 사이트에서 사용하는 동일한 비밀번호나 쉬운 비밀번호로 설정 시 도용될 위험이 있습니다.</p>
                  </div>
                </div>
                {error && <p id="recovery-error" className="account-error" role="alert">{error}</p>}
                <button type="submit" className="btn btn-primary btn-lg btn-login" disabled={!password || !confirmation}>비밀번호 변경</button>
              </>
            )}
          </form>
        )}
      </div>
    </dialog>
  );
}

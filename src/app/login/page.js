"use client";

import { useState } from "react";
import AccountRecovery from "@/_component/AccountRecovery";

export default function Login() {
	const [loginId, setLoginId] = useState("");
	const [loginPwd, setLoginPwd] = useState("");
	const [recoveryMode, setRecoveryMode] = useState(null);

	return (
		<>
			<link rel="stylesheet" href="/css/login.css" />
			<div className="login">
				<h1 className="logo">
					<img
						src="/images/pomit_white_h.svg"
						alt="POMIT"
						style={{ height: "36px" }}
						width={100}
						height={36}
					/>{" "}
					<span>DCIM 시스템</span>
				</h1>

				<div id="container" className="container">
					<h2 id="logo" className="logo">
						<img
							src="/images/pomit_white_h.svg"
							alt="POMIT"
							style={{ height: "36px" }}
							width={100}
							height={36}
						/>{" "}
						<span>DCIM</span>
					</h2>

					<div className="login-form">
						<h3 className="form-title">로그인</h3>
						<div className="form-box" id="loginSection">
							<div className="form-item">
								<label htmlFor="loginId" className="form-label">
									아이디{" "}
									<span
										className="required"
										aria-label="필수 입력 항목"
										aria-hidden="true"
									>
										*
									</span>
								</label>
								<input
									className="form-control"
									id="loginId"
									type="text"
									value={loginId}
									onChange={(event) => setLoginId(event.target.value)}
								/>
							</div>
							<div className="form-item">
								<label htmlFor="loginPwd" className="form-label">
									비밀번호{" "}
									<span
										className="required"
										aria-label="필수 입력 항목"
										aria-hidden="true"
									>
										*
									</span>
								</label>
								<input
									className="form-control"
									id="loginPwd"
									type="password"
									value={loginPwd}
									onChange={(event) => setLoginPwd(event.target.value)}
								/>
							</div>

							<button
								type="button"
								id="loginBtn"
								className="btn btn-lime btn-lg btn-login"
								disabled={!loginId.trim() || !loginPwd}
							>
								로그인
							</button>
							<nav className="login-links" aria-label="계정 도움말">
								<button
									type="button"
									className="login-link"
									onClick={() => setRecoveryMode("id")}
								>
									아이디 찾기
								</button>
								<button
									type="button"
									className="login-link"
									onClick={() => setRecoveryMode("password")}
								>
									비밀번호 찾기
								</button>
								<a className="login-link" href="/join">
									회원가입
								</a>
							</nav>
						</div>
					</div>
				</div>
			</div>
			{recoveryMode && (
				<AccountRecovery
					key={recoveryMode}
					mode={recoveryMode}
					onClose={(nextMode) => setRecoveryMode(nextMode || null)}
				/>
			)}
		</>
	);
}

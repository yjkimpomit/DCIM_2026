"use client";

import { useEffect, useRef, useState } from "react";
import AddressSearchDialog from "@/_component/AddressSearchDialog";
import PasswordHelp from "@/_component/PasswordHelp";
import { passwordRules, validatePassword } from "@/_lib/password";

export default function Join() {
	const [error, setError] = useState("");
	const [addressSearchOpen, setAddressSearchOpen] = useState(false);
	const [address, setAddress] = useState({ postcode: "", address: "", detail: "" });
	const detailAddressRef = useRef(null);
	const focusDetailAddress = useRef(false);

	useEffect(() => {
		if (!addressSearchOpen && focusDetailAddress.current) {
			focusDetailAddress.current = false;
			detailAddressRef.current?.focus();
		}
	}, [addressSearchOpen]);

	function submit(event) {
		event.preventDefault();
		const values = new FormData(event.currentTarget);
		setError(validatePassword({ password: values.get("password"), confirmation: values.get("passwordConfirmation"), username: values.get("username"), mobile: values.get("mobile") }));
	}

	return (
		<>
			<link rel="stylesheet" href="/css/join.css" />
			<div className="join">
				<header className="join-header">
					<h1 className="logo">
						<img
							src="/images/pomit_white_h.svg"
							alt="POMIT"
							style={{ height: "36px" }}
							width={100}
							height={36}
						/>{" "}
						<span>DCIM</span>
					</h1>
				</header>

				<main className="join-form form">
					<h2 className="form-title">회원가입</h2>
					<p className="form-guide">
						<span className="form-field-required" aria-hidden="true">
							*
						</span>{" "}
						해당 표시가 되어 있는 항목은 필수 입력사항입니다.
					</p>

					<form
						className="form-grid form-grid-two"
						onSubmit={submit}
					>
						<div className="form-field">
							<label htmlFor="join-id" className="form-label">
								아이디{" "}
								<span className="form-field-required" aria-hidden="true">
									*
								</span>
							</label>
							<input
								className="form-control"
								id="join-id"
								name="username"
								type="text"
								autoComplete="username"
								required
							/>
						</div>
						<div className="form-field">
							<label htmlFor="join-name" className="form-label">
								이름{" "}
								<span className="form-field-required" aria-hidden="true">
									*
								</span>
							</label>
							<input
								className="form-control"
								id="join-name"
								name="name"
								type="text"
								autoComplete="name"
								required
							/>
						</div>
						<div className="form-field">
							<label htmlFor="join-password" className="form-label">
								비밀번호{" "}
								<span className="form-field-required" aria-hidden="true">
									*
								</span>
							</label>
							<input
								className="form-control"
								id="join-password"
								name="password"
								type="password"
								autoComplete="new-password"
								{...passwordRules}
								aria-describedby="join-password-help"
								required
							/>
						</div>
						<div className="form-field">
							<label htmlFor="join-password-confirm" className="form-label">
								비밀번호 확인{" "}
								<span className="form-field-required" aria-hidden="true">
									*
								</span>
							</label>
							<input
								className="form-control"
								id="join-password-confirm"
								name="passwordConfirmation"
								type="password"
								autoComplete="new-password"
								minLength={passwordRules.minLength}
								maxLength={passwordRules.maxLength}
								aria-describedby="join-password-help"
								required
							/>
						</div>
						<PasswordHelp id="join-password-help" className="form-field-full" />
						<div className="form-field">
							<label htmlFor="join-email" className="form-label">
								이메일{" "}
								<span className="form-field-required" aria-hidden="true">
									*
								</span>
							</label>
							<input
								className="form-control"
								id="join-email"
								name="email"
								type="email"
								autoComplete="email"
								required
							/>
						</div>
						<div className="form-field">
							<label htmlFor="join-mobile" className="form-label">
								휴대전화{" "}
								<span className="form-field-required" aria-hidden="true">
									*
								</span>
							</label>
							<input
								className="form-control"
								id="join-mobile"
								name="mobile"
								type="tel"
								autoComplete="mobile tel"
								required
							/>
						</div>
						<div className="form-field">
							<label htmlFor="join-birthday" className="form-label">
								생년월일
							</label>
							<input
								className="form-control"
								id="join-birthday"
								name="birthday"
								type="date"
								autoComplete="bday"
							/>
						</div>
						<div className="form-field">
							<label htmlFor="join-telephone" className="form-label">
								전화번호
							</label>
							<input
								className="form-control"
								id="join-telephone"
								name="telephone"
								type="tel"
								autoComplete="home tel"
							/>
						</div>
						<div className="form-field form-field-full">
							<label htmlFor="join-postcode" className="form-label">
								주소
							</label>
							<div className="form-address">
								<div className="form-inline form-postcode">
									<input
										className="form-control"
										id="join-postcode"
										name="postcode"
										value={address.postcode}
										onChange={(event) => setAddress({ ...address, postcode: event.target.value })}
										type="text"
										inputMode="numeric"
										autoComplete="postal-code"
										aria-label="우편번호"
									/>
									<button type="button" className="btn btn-primary btn-lg" onClick={() => setAddressSearchOpen(true)} aria-haspopup="dialog">
										주소 검색
									</button>
								</div>
								<input
									className="form-control"
									name="address"
									value={address.address}
									onChange={(event) => setAddress({ ...address, address: event.target.value })}
									type="text"
									autoComplete="address-line1"
									placeholder="기본주소 입력"
									aria-label="기본주소"
								/>
								<input
									className="form-control"
									name="addressDetail"
									ref={detailAddressRef}
									value={address.detail}
									onChange={(event) => setAddress({ ...address, detail: event.target.value })}
									type="text"
									autoComplete="address-line2"
									placeholder="상세주소 입력"
									aria-label="상세주소"
								/>
								<p className="form-help">
									<span
										className="form-help-icon"
										aria-hidden="true"
									></span>
									주소 검색 후 상세주소까지 입력해야 회원가입이 완료됩니다.
								</p>
							</div>
						</div>
						{error && <p className="form-error form-field-full" role="alert">{error}</p>}
						<div className="form-actions form-field-full">
							<button type="submit" className="btn btn-primary btn-lg btn-login">
								가입 완료
							</button>
						</div>
					</form>
				</main>
			</div>
			{addressSearchOpen && (
				<AddressSearchDialog
					onClose={() => setAddressSearchOpen(false)}
					onSelect={(selected) => {
						focusDetailAddress.current = true;
						setAddress({ ...selected, detail: "" });
						setAddressSearchOpen(false);
					}}
				/>
			)}
		</>
	);
}

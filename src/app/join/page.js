"use client";

export default function Join() {
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

        <main className="join-form form-box">
          <h2 className="form-title">회원가입</h2>
          <p className="join-notice">
            <span className="required" aria-hidden="true">
              *
            </span>{" "}
            해당 표시가 되어 있는 항목은 필수 입력사항입니다.
          </p>

          <form
            className="form-box"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="form-item">
              <label htmlFor="joinId" className="form-label">
                아이디{" "}
                <span className="required" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                className="form-control"
                id="joinId"
                name="username"
                type="text"
                autoComplete="username"
                required
              />
            </div>
            <div className="form-item">
              <label htmlFor="joinName" className="form-label">
                이름{" "}
                <span className="required" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                className="form-control"
                id="joinName"
                name="name"
                type="text"
                autoComplete="name"
                required
              />
            </div>
            <div className="form-item">
              <label htmlFor="joinEmail" className="form-label">
                이메일{" "}
                <span className="required" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                className="form-control"
                id="joinEmail"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>
            <div className="form-item">
              <label htmlFor="joinPassword" className="form-label">
                비밀번호{" "}
                <span className="required" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                className="form-control"
                id="joinPassword"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={15}
                aria-describedby="joinPasswordHelp"
                required
              />
            </div>
            <div className="form-item">
              <label htmlFor="joinPasswordConfirm" className="form-label">
                비밀번호 확인{" "}
                <span className="required" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                className="form-control"
                id="joinPasswordConfirm"
                name="passwordConfirmation"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={15}
                aria-describedby="joinPasswordHelp"
                required
              />
            </div>
            <div id="joinPasswordHelp" className="account-help">
              <span className="account-help-icon" aria-hidden="true"></span>
              <div className="account-help-content">
                <p>입력자리 수 제한: 최소 8 / 최대 15</p>
                <p>필수 입력 값: 영문대문자, 영문소문자, 숫자, 특수문자</p>
                <p>입력 제한 값: 아이디, 휴대전화</p>
                <p className="account-help-warning">
                  여러 사이트에서 사용하는 동일한 비밀번호나 쉬운 비밀번호로
                  설정 시 도용될 위험이 있습니다.
                </p>
              </div>
            </div>
            <div className="form-item">
              <label htmlFor="joinMobile" className="form-label">
                휴대전화{" "}
                <span className="required" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                className="form-control"
                id="joinMobile"
                name="mobile"
                type="tel"
                autoComplete="mobile tel"
                required
              />
            </div>
            <div className="form-item">
              <label htmlFor="joinTelephone" className="form-label">
                전화번호
              </label>
              <input
                className="form-control"
                id="joinTelephone"
                name="telephone"
                type="tel"
                autoComplete="home tel"
              />
            </div>
            <div className="form-item">
              <label htmlFor="joinBirthday" className="form-label">
                생년월일
              </label>
              <input
                className="form-control form-control-date"
                id="joinBirthday"
                name="birthday"
                type="date"
                autoComplete="bday"
              />
            </div>
            <div className="form-item">
              <label htmlFor="joinPostcode" className="form-label">
                주소
              </label>
              <div className="join-address">
                <div className="join-postcode">
                  <input
                    className="form-control"
                    id="joinPostcode"
                    name="postcode"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    aria-label="우편번호"
                  />
                  <button type="button" className="btn btn-primary btn-lg">
                    주소 검색
                  </button>
                </div>
                <input
                  className="form-control"
                  name="address"
                  type="text"
                  autoComplete="address-line1"
                  placeholder="기본주소 입력"
                  aria-label="기본주소"
                />
                <input
                  className="form-control"
                  name="addressDetail"
                  type="text"
                  autoComplete="address-line2"
                  placeholder="상세주소 입력"
                  aria-label="상세주소"
                />
                <p className="join-address-help">
                  <span
                    className="account-help-icon join-address-icon"
                    aria-hidden="true"
                  ></span>
                  주소 검색 후 상세주소까지 입력해야 회원가입이 완료됩니다.
                </p>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-login">
              가입 완료
            </button>
          </form>
        </main>
      </div>
    </>
  );
}

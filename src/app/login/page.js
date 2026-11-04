
export default function Login() {
  return (
    <>
  <link rel="stylesheet" href="/css/login.css" />
<div className="login">
	<div id="container" className="container">
		<h1 id="logo" className="logo">
			<img src="/images/twinplant_silver_h.svg" alt="POMIT"  style={{height: "40px;"}} width={100} height={40}/> <span>DCIM</span>
		</h1>
		<div className="login-form">
			<div className="form-box" id="loginSection">
				<div className="form-item">
					<label className="loginId visually-hidden">아이디</label>
					<input className="form-control" id="loginId" type="text" placeholder="아이디"/>
				</div>
				<div className="form-item">
					<label htmlFor="loginPwd" className="visually-hidden">비밀번호</label>
					<input className="form-control" id="loginPwd" type="password" placeholder="비밀번호"/>
				</div>

				<button type="button" id="loginBtn" className="btn btn-login">로그인</button>
			</div>
		</div>

	</div>

</div>
    </>
  );
}

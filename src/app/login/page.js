
export default function Login() {
  return (
    <>
<link rel="stylesheet" href="/css/login.css" />
<div className="login">
	<h1 className="logo">
		<img src="/images/pomit_white_h.svg" alt="POMIT"  style={{height: "36px;"}} width={100} height={36}/> <span>DCIM 시스템</span>
	</h1>
			  
	<div id="container" className="container">
		<h2 id="logo" className="logo">
			<img src="/images/pomit_white_h.svg" alt="POMIT"  style={{height: "36px;"}} width={100} height={36}/> <span>DCIM</span>
		</h2>
		
		<div className="login-form">
			<h3 className="form-title">로그인</h3>
			<div className="form-box" id="loginSection">
				<div className="form-item">
					<label htmlFor="loginId" className="form-label">아이디</label>
					<input className="form-control" id="loginId" type="text"/>
				</div>
				<div className="form-item">
					<label htmlFor="loginPwd" className="form-label">비밀번호</label>
					<input className="form-control" id="loginPwd" type="password"/>
				</div>

				<button type="button" id="loginBtn" className="btn btn-login">로그인</button>
			</div>
		</div>

	</div>

</div>
    </>
  );
}

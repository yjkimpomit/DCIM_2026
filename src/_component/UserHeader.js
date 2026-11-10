export default function UserHeader() {
	return (
		<header className="user-header">
			<h1 className="logo">
				<img src="/images/pomit_white_h.svg" alt="POMIT" style={{ height: "36px" }} width={100} height={36} />{" "}
				<span>DCIM 시스템</span>
			</h1>
			<div className="header-actions">
				<time className="header-clock" dateTime="2026-09-08T09:08:24">2026-09-08 09:08:24</time>
				<a className="header-button" href="/login" aria-label="로그아웃"><span aria-label="아이디">pomit</span> 로그아웃</a>
				<a className="button-icon button-icon-settings" href="/admin" aria-label="관리자 메인으로 이동" title="관리자 메인으로 이동" />
			</div>
		</header>
	);
}

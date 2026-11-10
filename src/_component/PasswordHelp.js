export default function PasswordHelp({ id, className = "" }) {
	return (
		<div id={id} className={`form-help${className ? ` ${className}` : ""}`}>
			<span className="form-help-icon" aria-hidden="true"></span>
			<div className="form-help-content">
				<p>입력자리 수 제한: 최소 8 / 최대 15</p>
				<p>필수 입력 값: 영문대문자, 영문소문자, 숫자, 특수문자</p>
				<p>입력 제한 값: 아이디, 휴대전화</p>
				<p className="form-help-warning">여러 사이트에서 사용하는 동일한 비밀번호나 쉬운 비밀번호로 설정 시 도용될 위험이 있습니다.</p>
			</div>
		</div>
	);
}

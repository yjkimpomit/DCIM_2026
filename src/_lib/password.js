export const passwordRules = {
	minLength: 8,
	maxLength: 15,
	pattern: "(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,15}",
	title: "8~15자, 영문 대문자·소문자·숫자·특수문자 포함",
};

export function validatePassword({ password, confirmation, username = "", mobile = "", currentPassword }) {
	if (!new RegExp(`^(?:${passwordRules.pattern})$`).test(password)) {
		return "비밀번호는 8~15자이며 영문 대문자·소문자·숫자·특수문자를 모두 포함해야 합니다.";
	}
	if (password !== confirmation) return "비밀번호가 일치하지 않습니다.";
	if (currentPassword !== undefined && password === currentPassword) return "기존 비밀번호와 다른 비밀번호를 입력해 주세요.";
	const accountId = username.trim().toLowerCase();
	const phoneDigits = mobile.replace(/\D/g, "");
	if ((accountId && password.toLowerCase().includes(accountId)) || (phoneDigits && password.includes(phoneDigits))) {
		return "아이디와 휴대전화 번호를 포함하지 않는 비밀번호를 입력해 주세요.";
	}
	return "";
}

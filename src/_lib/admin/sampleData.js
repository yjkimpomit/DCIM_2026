const policyRows = [
  ["온도", "환경", "30°C 이상", "위험", ["SMS"]],
  ["CPU 사용률", "환경", "70°C 이상", "위험", ["SMS"]],
  ["습도", "환경", "50% 이상", "위험", ["SMS"]],
  ["CPU 사용률", "장비", "90% 이상", "점검", ["SMS", "이메일"]],
  ["장비 상태", "장비", "장비 다운 시", "점검", ["SMS"]],
  ["전력 사용량", "전력", "기준값 초과 시", "점검", ["SMS"]],
  ["네트워크 트래픽", "보안", "임계값 초과 시", "점검", ["SMS"]],
  ["보안 위협", "전력", "위협 탐지 시", "점검", ["SMS"]],
  ["UPS 배터리", "전력", "20% 이하", "점검", ["SMS"]],
  ["전원", "전력", "전원 차단 시", "점검", ["SMS"]],
];
export const samplePolicies = policyRows.map(([name, type, value1, severity, methods], index) => ({ id: index + 1, name, type, value1, value2: "", severity, methods, enabled: index === 2 || index === 4, modified: "2026-08-28 14:02:05" }));
export const sampleUsers = ["김민준", "이서연", "박지훈", "최하은", "정도윤", "강지우", "조현우", "윤수빈", "장서준", "임채원"].map((name, index) => ({
  id: index + 1, username: `member${String(index + 1).padStart(3, "0")}`, name,
  email: `user${String(index + 1).padStart(2, "0")}@example.com`, mobile: `010-0000-${String(index + 1).padStart(4, "0")}`,
  role: index === 1 || index === 2 ? "일반" : index === 6 ? "승인" : "관리자",
  birth: "2026-12-31", telephone: "02-1234-0000", postcode: "48059", address: "부산광역시 해운대구 센텀동로 41", detailAddress: "센텀벤처타운 205호",
}));
export const sampleProfile = { ...sampleUsers[0], username: "Administrator", name: "홍길동", email: "admin365@example.com" };

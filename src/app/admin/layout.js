import AdminFrame from "@/_component/admin/AdminFrame";

export const metadata = { title: "관리자 | 포미트 DCIM 시스템" };
export const dynamic = "force-dynamic";

export default function Layout({ children }) {
	return (
		<AdminFrame initialTime={new Date().toISOString()}>{children}</AdminFrame>
	);
}

"use client";

import WeatherPanel from "@/_component/WeatherPanel";

import { usePathname } from "next/navigation";
const adminNavigation = [
	{ title: "정보 관리", items: [{ title: "알람 정책 관리", href: "/admin/alarms" }] },
	{ title: "회원 관리", items: [{ title: "회원 목록", href: "/admin/users" }] },
];

export default function AdminSidebar() {
	const pathname = usePathname();
	return (
		<aside className="admin-sidebar" aria-label="날씨 및 관리자 메뉴">
			<WeatherPanel />
			<nav className="admin-navigation" aria-label="관리자 메뉴">
				{adminNavigation.map((group) => (
					<section className="admin-nav-group" key={group.title}>
						<h2 className="admin-nav-title">{group.title}</h2>
						<ul className="admin-nav-list">
							{group.items.map((item) => {
								const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
								return <li key={item.href}><a className={`admin-nav-link${current ? " is-current" : ""}`} href={item.href} aria-current={current ? "page" : undefined}>{item.title}</a></li>;
							})}
						</ul>
					</section>
				))}
			</nav>
		</aside>
	);
}

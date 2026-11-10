import WeatherPanel from "@/_component/WeatherPanel";
const userNavigation = [
	{
		title: "SERVER ROOM MONITORING",
		items: [
			{ title: "대시보드", href: "/server-dashboard", active: "dashboard" },
			{ title: "컴퓨팅 리소스", href: "/server-resources", active: "computing" },
			{ title: "전력 및 보안", href: "/server-power-security", active: "power" },
			{ title: "알람", href: "/server-alarms", active: "alarms" },
		],
	},
	{
		title: "IMMERSION COOLING MONITORING",
		items: [
			{ title: "대시보드", href: "/immersion-dashboard", active: "immersion-dashboard" },
			{ title: "프로세스 구성도", href: "/immersion-monitoring", active: "immersion-process" },
			{ title: "알람", href: "/immersion-alarms", active: "immersion-alarms" },
		],
	},
];

export default function UserSidebar({ active = "dashboard" }) {
	return (
		<aside className="user-sidebar" aria-label="날씨 및 주 메뉴">
			<WeatherPanel />

			<nav className="user-navigation" aria-label="관제 메뉴">
				{userNavigation.map((group) => (
					<section className="user-nav-group" key={group.title}>
						<h2 className="user-nav-title">{group.title}</h2>
						<ul className="user-nav-list">
							{group.items.map((item) => {
								const current = active === item.active;
								return (
									<li key={item.href}>
										<a className={`user-nav-link${current ? " is-current" : ""}`} href={item.href} aria-current={current ? "page" : undefined}>
											{item.title}
										</a>
									</li>
								);
							})}
						</ul>
					</section>
				))}
			</nav>
		</aside>
	);
}

"use client";

import WeatherPanel from "@/_component/WeatherPanel";

import { usePathname } from "next/navigation";
import { adminNavigation } from "@/_lib/admin/navigation";

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

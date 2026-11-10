"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import { subscribeAlarmMonitor, INTERVAL, SET_ALARM_RECENT } from "@/_lib/wsMonitor";

export default function UserHeader() {
	const [recent, setRecent] = useState(0);

	useEffect(() => {
		if (!process.env.NEXT_PUBLIC_SOCKET_BACKEND) return;
		const ws = subscribeAlarmMonitor({
			interval: INTERVAL,
			host_type: "DellServer",
			onData: (res) => {
				let cnt = 0;
				res.data.forEach((i) => {
					const isRecent = moment.unix(i.clock).isAfter(moment().subtract(SET_ALARM_RECENT, 'minutes'));
					if (isRecent) cnt++;
				});
				setRecent(cnt);
			},
			onError: () => setRecent(0),
		});
		ws.addEventListener("close", () => setRecent(0));
		return () => ws.close();
	}, []);

	const alarmLabel = `서버룸 모니터링 최근 ${SET_ALARM_RECENT}분 알람 ${recent}건`;
	return (
		<header className="user-header">
			<h1 className="logo">
				<img src="/images/pomit_white_h.svg" alt="POMIT" style={{ height: "36px" }} width={100} height={36} />{" "}
				<span>DCIM 시스템</span>
			</h1>
			<div className="header-actions">
				<time className="header-clock" dateTime="2026-09-08T09:08:24">2026-09-08 09:08:24</time>
				<a className="button-icon button-icon-alarm header-alarm" href="/server-alarms" aria-label={`${alarmLabel} 화면으로 이동`} title={alarmLabel}>
					<span className="header-alarm-count" aria-hidden="true">{recent}</span>
				</a>
				<a className="header-button" href="/login" aria-label="로그아웃"><span aria-label="아이디">pomit</span> 로그아웃</a>
				<a className="button-icon button-icon-settings" href="/admin" aria-label="관리자 메인으로 이동" title="관리자 메인으로 이동" />
			</div>
		</header>
	);
}

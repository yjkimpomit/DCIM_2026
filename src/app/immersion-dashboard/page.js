"use client";

import LiveAlarmPanel from "@/_component/LiveAlarmPanel";
import PanelHeading from "@/_component/PanelHeading";
import { useEffect, useState } from 'react';
import { subscribeServerMonitor, subscribeAlarmMonitor, INTERVAL } from '@/_lib/wsMonitor';
import MiniGaugeChart from "@/_component/MiniGaugeChart";
import ResourceMeterChart from "@/_component/ResourceMeterChart";
import UserFrame from "@/_component/UserFrame";
import UserPageHeader from "@/_component/UserPageHeader";

export default function ServerMonitoring() {
	const [data, setData] = useState({
		pue: 0,
		server_power: 0,
		system_power: 0,
		tank_temp: 0,
		total_power: 0,
		cpu: 0,
		memory: 0,
		gpu: 0,
		disk_write: 0,
		disk_read: 0
	});
	const [alarm, setAlarm] = useState([]);
	const iframe_url = process.env.NEXT_PUBLIC_UNITY_SERVER;

	useEffect(() => {
		const ws = subscribeServerMonitor({
			interval: INTERVAL,
			onData: (data) => {
				const res = data.data;
				const pue = res["pue"].value * 1;
				const server_power = res["server_power"].value * 1;
				const system_power = res["system_power"].value * 1;
				const tank_temp = res["tank_temp"].value * 1;
				const total_power = res["total_power"].value * 1;
				const cpu = (res["cpu"]?.value * 1)?.toFixed(2);
				const memory = (res["memory"]?.value * 1)?.toFixed(2);
				const gpu = (res["gpu"]?.value * 1 || 0).toFixed(2);
				const disk_read = (res["disk_read"]?.value * 1)?.toFixed(2);
				const disk_write = (res["disk_write"]?.value * 1)?.toFixed(2);

				setData({
					pue, server_power, system_power, tank_temp, total_power, cpu, gpu, memory, disk_read, disk_write
				})

			},
			onError: (e) => console.log(e)
		});
		return () => ws && ws.close();
	}, []);

	useEffect(() => {
		const ws = subscribeAlarmMonitor({
			interval: INTERVAL,
			host_type: "DellServer",
			onData: (res) => {
				setAlarm(res.data);
			},
			onError: (e) => console.log(e)
		});

		return () => ws && ws.close();
	}, []);

	const [server, setServer] = useState(1);
	const power = [
		{ label: "TOTAL", value: data.total_power, color: "lime" },
		{ label: "SYSTEM", value: data.system_power, color: "lime" },
		{ label: "SERVER", value: data.server_power, color: "lime" },
	];

	return (
		<>
			<UserFrame active="immersion-dashboard" screenClassName="user-live-screen">
				<main className="user-viewer user-viewer-overlay user-live-viewer">
					<UserPageHeader title="대시보드" section="IMMERSION COOLING MONITORING" homeHref="/immersion-dashboard" />
					<div id="unity" className="user-model immersion-dashboard-model">
						{/* <!-- 액침냉각 장비 배치 Unity 뷰어 --> */}
						<iframe className="user-model-frame" src={iframe_url} title="액침냉각 장비 배치 Unity 뷰어" loading="lazy" allowFullScreen />
					</div>
				</main>
				<aside id="immersionDashboard" className="user-summary immersion-summary" aria-label="액침냉각 현황">
					<div className="immersion-metrics">
						<section>
							<PanelHeading as="h2" title={<>PUE</>} titleClassName="user-summary-title" className="panel-heading-summary" />
							<div className="panel-card immersion-metric-card">
								<MiniGaugeChart label="PUE" value={data.pue} max={3} color="cyan" />
							</div>
						</section>
						<section>
							<PanelHeading as="h2" title={<>Tank Temp</>} titleClassName="user-summary-title" className="panel-heading-summary" />
							<div className="panel-card immersion-metric-card">
								<MiniGaugeChart label="Tank Temp" value={data.tank_temp} max={60} unit="°C" color="orange" />
							</div>
						</section>
					</div>
					<section className="panel-section user-summary-section">
						<PanelHeading as="h2" title={<>서버 리소스 #{server}</>} titleClassName="user-summary-title" className="panel-heading-summary" actions={<><div className="user-cctv-controls">
							<button type="button" className="user-card-button button-icon button-icon-previous" disabled={server === 1} onClick={() => setServer(server - 1)} aria-label="이전 서버" />
							<button type="button" className="user-card-button button-icon button-icon-next" disabled={server === 4} onClick={() => setServer(server + 1)} aria-label="다음 서버" />
						</div></>} />
						{/* 기존 #1~#3의 동일한 데이터 연결과 #4의 미연결 상태를 유지한다. */}
						<div className="panel-card user-resource-list immersion-server-resources">
							{server < 4 ? <>
								<ResourceMeterChart label="CPU" value={data.cpu} color="usage" />
								<ResourceMeterChart label="GPU" value={data.gpu} color="usage" />
								<ResourceMeterChart label="메모리" value={data.memory} color="usage" />
								<ResourceMeterChart label="디스크" value={(data.disk_read * 1) + (data.disk_write * 1)} color="usage" />
							</> : <p className="immersion-resource-empty" role="status">연결된 리소스 데이터가 없습니다.</p>}
						</div>
					</section>
					<section className="panel-section user-summary-section">
						<PanelHeading as="h2" title={<>POWER</>} titleClassName="user-summary-title" className="panel-heading-summary" />
						<div className="panel-card user-resource-list">
							{power.map(({ label, value, color }) => (
								<ResourceMeterChart key={label} label={label} value={(value / 5) * 100} color={color} displayValue={value + "kW"} />
							))}
						</div>
					</section>
					<LiveAlarmPanel alarms={alarm} moreHref="/immersion-alarms" />
				</aside>
			</UserFrame>
		</>
	);
}

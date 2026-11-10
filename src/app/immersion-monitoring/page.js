"use client";

import LiveAlarmPanel from "@/_component/LiveAlarmPanel";
import PanelHeading from "@/_component/PanelHeading";
import { useEffect, useState } from 'react';
import ImmersionSvg from '@/_component/ImmersionSvg';
import { subscribeAlarmMonitor, subscribeImmersionMonitor, INTERVAL } from '@/_lib/wsMonitor';
import MiniGaugeChart from "@/_component/MiniGaugeChart";
import UserFrame from "@/_component/UserFrame";
import UserPageHeader from "@/_component/UserPageHeader";

export default function Page() {
	const [data, setData] = useState({
		setpoint_temp: null, // 서버 미제공
		actual_temp: null, // 서버 미제공
		pue: 0,
		server_power: 0,
		system_power: 0,
		tank_temp: 0,
		tank_out_temp: 0,
		tank_in_temp: 0,
		total_power: 0,
		inverter_hz: 0,
		set_temp: 0,
		cooler_flow: 0,
		cooler_out_temp: 0,
		cooler_in_temp: 0,
		pressure: null, // 서버 미제공
		cooler_power: null, // 서버 미제공
		pump_a_run: 0,
		pump_b_run: 0,
		coolant_flow: 0
	});
	const [alarm, setAlarm] = useState([]);

	useEffect(() => {
		const ws = subscribeImmersionMonitor({
			interval: INTERVAL,
			onData: (res) => {
				const tmp = res.data
				const pue = tmp["pue"].value * 1;
				const server_power = tmp["server_power"].value * 1;
				const system_power = tmp["system_power"].value * 1;
				const total_power = tmp["total_power"].value * 1;
				const tank_temp = tmp["tank_temp"].value * 1;
				const tank_in_temp = tmp["tank_in_temp"].value * 1;
				const tank_out_temp = tmp["tank_out_temp"].value * 1;
				const inverter_hz = tmp["inverter_hz"].value * 1;
				const cooler_flow = tmp["cooler_flow"].value * 1;
				const cooler_in_temp = tmp["cooler_in_temp"].value * 1;
				const cooler_out_temp = tmp["cooler_out_temp"].value * 1;
				const set_temp = tmp["set_temp"].value * 1;
				const pump_a_run = tmp["pump_a_run"].value * 1;
				const pump_b_run = tmp["pump_b_run"].value * 1;
				const coolant_flow = tmp["coolant_flow"].value * 1;
				setData(prev => ({
					...prev,
					pue, server_power, system_power, tank_in_temp, tank_temp, tank_out_temp, total_power, inverter_hz,
					cooler_flow, cooler_in_temp, cooler_out_temp, set_temp, pump_b_run, pump_a_run, coolant_flow
				}))

			},
			onError: (e) => console.log(e)
		});
		return () => ws && ws.close();
	}, []);

	useEffect(() => {
		const ws = subscribeAlarmMonitor({
			interval: INTERVAL,
			host_type: "SmartBox",
			onData: (res) => {
				setAlarm(res.data);
			},
			onError: (e) => console.log(e)

		});

		return () => ws && ws.close();
	}, []);

	const { pressure, pue, tank_in_temp, tank_temp, tank_out_temp, inverter_hz, cooler_flow, set_temp, server_power, system_power, total_power } = data;

	const panels = [
		{
			title: "TOTAL POWER", value: data.total_power, max: 55.0, color: "orange",
			fields: [["PUE", pue], ["TANK INLET", tank_in_temp + "°C"], ["SETPOINT TEMP", set_temp + "°C"]],
		},
		{
			title: "SYSTEM POWER", value: data.system_power, max: 5.0, color: "cyan",
			fields: [["TANK TEMP", tank_temp + "°C"], ["TANK OUTLET", tank_out_temp + "°C"], ["INVERTER SETUP", inverter_hz + "Hz"]],
		},
		{
			title: "SERVER POWER", value: data.server_power, max: 50.0, color: "lime",
			fields: [["TANK INLET", tank_in_temp + "°C"], ["PRESSURE", pressure == null ? "—" : pressure + "bar"], ["ALARM", alarm.length + "건"]],
		},
	];

	return (
		<>
			<UserFrame active="immersion-process" screenClassName="user-live-screen">
				<main className="user-viewer user-live-viewer">
					<UserPageHeader title="프로세스 구성도" section="IMMERSION COOLING MONITORING" homeHref="/immersion-dashboard" />
					<div className="user-model immersion-process-viewer immersion-live-model">
						<ImmersionSvg data={data} formatter={(key, value) => value == null ? "—" : String(value)} className="immersion-live-diagram" />
					</div>
				</main>
				<aside id="immersionDashboard" className="user-summary immersion-summary" aria-label="액침냉각 운전 정보">
					{panels.map(({ title, value, max, color, fields }) => (
						<section className="panel-section user-summary-section" key={title}>
							<PanelHeading as="h2" title={<>{title}</>} titleClassName="user-summary-title" className="panel-heading-summary" />
							<div className="panel-card immersion-power-card">
								<dl className="immersion-field-list">
									{fields.map(([label, fieldValue]) => (
										<div className="immersion-field" key={label}>
											<dt>{label}</dt>
											<dd>{fieldValue}</dd>
										</div>
									))}
								</dl>
								<MiniGaugeChart label={title} value={value} max={max} unit="kW" color={color} showScale sweep={270} />
							</div>
						</section>
					))}
					<LiveAlarmPanel alarms={alarm} moreHref="/immersion-alarms" />
				</aside>
			</UserFrame>
		</>
	);
}

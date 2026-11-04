"use client"
import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { subscribeServerMonitor, subscribeAlarmMonitor, INTERVAL, SET_ALARM_RECENT } from '@/_lib/wsMonitor';
import GaugeChart from "@/_component/GaugeChart";
import BarChart from "@/_component/BarChart";
import PageFrame from '@/_component/PageFrame';
import AlarmModal from '@/_component/AlarmModal';
export default function ServerMonitoring() {
	const [data, setData] = useState({
		pue: 0,
		server_power: 0,
		system_power: 0,
		tank_temp: 0,
		total_power: 0,
		cpu: 0,
		memory: 0,
		disk_write: 0,
		disk_read: 0
	});
	const [alarm, setAlarm] = useState([]);
	const [recent, setRecent] = useState(0);
	const [isOpen, setOpen] = useState(false);
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
				const disk_read = (res["disk_read"]?.value * 1)?.toFixed(2);
				const disk_write = (res["disk_write"]?.value * 1)?.toFixed(2);

				setData({
					pue, server_power, system_power, tank_temp, total_power, cpu, memory, disk_read, disk_write
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
				let cnt = 0;
				res.data.forEach((i) => {
					const isRecent = moment.unix(i.clock).isAfter(moment().subtract(SET_ALARM_RECENT, 'minutes'));
					if (isRecent) cnt++;
				});
				setRecent(cnt);
			},
			onError: (e) => console.log(e)
		});

		return () => ws && ws.close();
	}, []);
	
	const {
		pue,
		server_power,
		system_power,
		tank_temp,
		total_power,
		cpu,
		disk_read,
		disk_write,
		memory
	} = data;
	return (
		<>

			<PageFrame
				setRecent={setRecent}
				recent={recent}
				setOpen={setOpen}
			/>
			<div className="monitoring-server">
				{/* <!-- 유니티 영역 --> */}
				<div className="server-box">
					<div id="unity" className="unity-container">
						{/* <!-- 여기에 유니티 넣어주시면 됩니다. --> */}
						{/* <img src="/images/unity-sample.png" className="img-fluid"/> */}
						<iframe
							/* src={iframe_url} */
							style={{ width: "100%", height: "850px", border: "0" }}
							loading='lazy'
							allowFullScreen
						></iframe>

					</div>
				</div>

				<div id="serverDashboard" className="dashboard server">
					<div className="sec-group-v">
						<section className="section sec-1">
							<h2 className="section-title">PUE</h2>
							<div className="section-body pue">
								<span className="value">{pue}</span>
							</div>
						</section>
						<section className="section sec-2">
							<h2 className="section-title">TANK TEMP</h2>
							<div className="section-body tank">
								<span className="value">{tank_temp}</span>
								<span className="unit">°C</span>
							</div>
						</section>
					</div>

					<section className="section sec-3">
						<div className="chart-group">
							{/* <!-- icon-3d 클릭시 유니티에 연결된 서버가 하이라이트 됩니다. --> */}
							<h2 className="section-title">Server Resource #1 <span className="icon-3d" title="#01 서버로 이동" onClick={() => { alert("준비중입니다.") }}></span></h2>
							<div className="chart-box bar">
								<div id="server-1" className="chart-bar">
									<BarChart
										container={"server-1"}
										dataValuesId={"data-values-1"}
										title={"SERVER RESOURCE #1"}
										data={[cpu, memory, 0, ((disk_read * 1) + (disk_write * 1))]}
									/>
								</div>
								<div id="data-values-1" className="data-values"></div>
							</div>
							<h2 className="section-title">Server Resource #2 <span className="icon-3d" title="#02 서버로 이동" onClick={() => { alert("준비중입니다.") }}></span></h2>
							<div className="chart-box bar">
								<div id="server-2" className="chart-bar">
									<BarChart
										container={"server-2"}
										dataValuesId={"data-values-2"}
										title={"SERVER RESOURCE #2"}
										data={[cpu, memory, 0, ((disk_read * 1) + (disk_write * 1))]}
									/>
								</div>
								<div id="data-values-2" className="data-values"></div>
							</div>
							<h2 className="section-title">Server Resource #3 <span className="icon-3d" title="#03 서버로 이동" onClick={() => { alert("준비중입니다.") }}></span></h2>
							<div className="chart-box bar">
								<div id="server-3" className="chart-bar">
									<BarChart
										container={"server-3"}
										dataValuesId={"data-values-3"}
										title={"SERVER RESOURCE #3"}
										data={[cpu, memory, 0, ((disk_read * 1) + (disk_write * 1))]}
									/>
								</div>
								<div id="data-values-3" className="data-values"></div>
							</div>
							<h2 className="section-title">Server Resource #4 <span className="icon-3d" title="#04 서버로 이동" onClick={() => { alert("준비중입니다.") }}></span></h2>
							<div className="chart-box bar">
								<div id="server-4" className="chart-bar"></div>
								<div id="data-values-4" className="data-values"></div>
							</div>
						</div>
					</section>

					<div className="sec-group-h">
						<section className="section power sec-4">
							<h2 className="section-title">Total Power</h2>
							<div className="chart-box gauge">
								{/* <!-- rotate 의 값은 chart-gauge.js 에서 계산된 angle 값을 대입한 결과입니다. 콘솔 참고 --> */}
								<div className="pointer-1" style={{ transform: "translate(-50%, -50%) rotate(150deg) ", transition: "transform 300ms cubic-bezier(.22,.61,.36,1)", "willChange": "transform" }}></div>
								<div id="gauge-1" className="chart-gauge">
									<GaugeChart
										container={"gauge-1"}
										pointer={"pointer-1"}
										title={"TOTAL POWER"}
										value={total_power}
										max={5.0}
										unit={"kW"}
										color={"#CCFF24"}

									/>
								</div>
							</div>
						</section>
						<section className="section power sec-5">
							<h2 className="section-title">System Power</h2>
							<div className="chart-box gauge">
								<div className="pointer-2" style={{ transform: "translate(-50%, -50%) rotate(150deg)", transition: "transform 300ms cubic-bezier(.22,.61,.36,1)", "willChange": "transform" }}></div>
								<div id="gauge-2" className="chart-gauge">
									<GaugeChart
										container={"gauge-2"}
										pointer={"pointer-2"}
										title={"SYSTEM POWER"}
										value={system_power}
										max={5.0}
										unit={"kW"}
										color={"#40D2FF"}
									/>
								</div>
							</div>
						</section>
						<section className="section power sec-6">
							<h2 className="section-title">Server Power</h2>
							<div className="chart-box gauge">
								<div className="pointer-3" style={{ transform: "translate(-50%, -50%) rotate(150deg)", transition: "transform 300ms cubic-bezier(.22,.61,.36,1)", "willChange": "transform" }}></div>
								<div id="gauge-3" className="chart-gauge">
									<GaugeChart
										container={"gauge-3"}
										pointer={"pointer-3"}
										title={"SERVER POWER"}
										value={server_power}
										max={5}
										unit={"kW"}
										color={"#FFFC00"}
									/>

								</div>
							</div>
						</section>
					</div>

					{/* <!-- 알람 / 이벤트 로그 --> */}
					<section className="section sec-7">
						<h2 className="section-title" onClick={() => { setOpen(true) }}>Alarm List</h2>
						<div className="alert list">
							<div className="list-header">
								<div className="item">
									<span className="icon-alarm"></span>
									<span className="date">DATE</span>
									<span className="tag">TAG</span>
									<span className="tag-exp">TAG Exp.</span>
									<span className="message">MESSAGE</span>
								</div>
							</div>
							{alarm?.map((res, idx) => {
								//set recent alarm in 10min.
								const isRecent = moment.unix(res.clock).isAfter(moment().subtract(SET_ALARM_RECENT, 'minutes'));
								return (
									<div className="item" key={`${res.clock}-${idx}`}>
										<span className={`icon-alarm ${isRecent ? 'active' : ''}`}></span>
										<span className="date">{moment.unix(res.clock).format('YYYY-MM-DD HH:mm:ss')}</span>
										<span className="tag">{res.severity}</span>
										<span className="tag-exp">{res.hosts?.[0]?.host}</span>
										<span className="message" title={res.name}>{res.name}</span>
									</div>
								);
							})}
						</div>
					</section>

				</div>
			</div>
			<AlarmModal alarm={alarm} setAlarm={setAlarm} type={"server"} isOpen={isOpen} setOpen={setOpen} />
		</>
	);
}

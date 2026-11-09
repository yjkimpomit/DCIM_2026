"use client"
import { useEffect, useState } from 'react';
import moment from 'moment';
import { subscribeServerMonitor, subscribeAlarmMonitor, INTERVAL, SET_ALARM_RECENT } from '@/_lib/wsMonitor';
import MiniGaugeChart from "@/_component/MiniGaugeChart";
import ResourceMeterChart from "@/_component/ResourceMeterChart";
import UserFrame from "@/_component/UserFrame";
import UserPageHeader from "@/_component/UserPageHeader";

// POWER 카드 표시 테스트. false로 변경하면 기존 실시간 수신값을 사용한다.
const USE_POWER_TEST_DATA = true;
const POWER_TEST_DATA = { total_power: 3.5, system_power: 1.2, server_power: 2.3 };
// 서버 리소스 카드 표시 테스트. false로 변경하면 기존 실시간 수신값을 사용한다.
const USE_RESOURCE_TEST_DATA = true;
const RESOURCE_TEST_DATA = { cpu: 75, memory: 52, gpu: 35, disk_read: 18, disk_write: 24 };
// PUE·Tank Temp 표시 테스트. false로 변경하면 기존 실시간 수신값을 사용한다.
const USE_METRIC_TEST_DATA = true;
const METRIC_TEST_DATA = { pue: 1.82, tank_temp: 30.8 };

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
  const [server, setServer] = useState(1);
  const powerData = USE_POWER_TEST_DATA ? POWER_TEST_DATA : data;
  const metricData = USE_METRIC_TEST_DATA ? METRIC_TEST_DATA : data;
  const resourceData = USE_RESOURCE_TEST_DATA ? RESOURCE_TEST_DATA : { ...data, gpu: 0 };
  const power = [
    { label: "TOTAL", value: powerData.total_power, color: "lime" },
    { label: "SYSTEM", value: powerData.system_power, color: "lime" },
    { label: "SERVER", value: powerData.server_power, color: "lime" },
  ];

  return (
    <>
      <UserFrame active="immersion-dashboard" screenClassName="user-live-screen">
        <main className="user-viewer user-viewer-overlay user-live-viewer">
          <UserPageHeader title="대시보드" section="immersion" />
          <div id="unity" className="user-model immersion-dashboard-model">
            <iframe className="user-model-frame" src={iframe_url} title="액침냉각 장비 배치 Unity 뷰어" loading="lazy" allowFullScreen />
          </div>
        </main>
        <aside id="immersionDashboard" className="user-summary immersion-summary" aria-label="액침냉각 현황">
          <div className="immersion-metrics">
            <section>
              <h2 className="user-summary-title">PUE</h2>
              <div className="panel-card immersion-metric-card">
                <MiniGaugeChart label="PUE" value={metricData.pue} max={3} color="cyan" />
              </div>
            </section>
            <section>
              <h2 className="user-summary-title">Tank Temp</h2>
              <div className="panel-card immersion-metric-card">
                <MiniGaugeChart label="Tank Temp" value={metricData.tank_temp} max={60} unit="°C" color="orange" />
              </div>
            </section>
          </div>
          <section className="user-summary-section">
            <div className="user-card-heading">
              <h2 className="user-summary-title">서버 리소스 #{server}</h2>
              <div className="user-cctv-controls">
                <button type="button" className="user-card-button button-icon button-icon-previous" disabled={server === 1} onClick={() => setServer(server - 1)} aria-label="이전 서버" />
                <button type="button" className="user-card-button button-icon button-icon-next" disabled={server === 4} onClick={() => setServer(server + 1)} aria-label="다음 서버" />
              </div>
            </div>
            {/* 기존 #1~#3의 동일한 데이터 연결과 #4의 미연결 상태를 유지한다. */}
            <div className="panel-card user-resource-list immersion-server-resources">
              {server < 4 ? <>
                <ResourceMeterChart label="CPU" value={resourceData.cpu} color="usage" />
                <ResourceMeterChart label="GPU" value={resourceData.gpu} color="usage" />
                <ResourceMeterChart label="메모리" value={resourceData.memory} color="usage" />
                <ResourceMeterChart label="디스크" value={(resourceData.disk_read * 1) + (resourceData.disk_write * 1)} color="usage" />
              </> : <p className="immersion-resource-empty" role="status">연결된 리소스 데이터가 없습니다.</p>}
            </div>
          </section>
          <section className="user-summary-section">
            <h2 className="user-summary-title">POWER</h2>
            <div className="panel-card user-resource-list">
              {power.map(({ label, value, color }) => (
                <ResourceMeterChart key={label} label={label} value={(value / 5) * 100} color={color} displayValue={value + "kW"} />
              ))}
            </div>
          </section>
          <section className="user-summary-section immersion-alarm-preview">
            <div className="user-card-heading">
              <h2 className="user-summary-title">알람</h2>
              <a className="user-card-button button-icon button-icon-add" href="/immersion-alarms" aria-label="알람 전체 보기" />
            </div>
            <div className="table-scroll user-table-scroll" tabIndex={0} role="region" aria-label="실시간 액침냉각 알람">
              <table className="data-table user-table user-table-compact immersion-alarm-table">
                <caption className="visually-hidden">알람 발생시각, TAG, TAG 설명, 메시지</caption>
                <thead><tr className="data-table-row"><th className="data-table-heading" scope="col">발생시각</th><th className="data-table-heading" scope="col">TAG</th><th className="data-table-heading" scope="col">TAG Exp.</th><th className="data-table-heading" scope="col">메시지</th></tr></thead>
                <tbody>
                  {alarm.map((res, index) => {
                    const isRecent = moment.unix(res.clock).isAfter(moment().subtract(SET_ALARM_RECENT, 'minutes'));
                    return (
                      <tr className="data-table-row" key={res.eventid || res.clock + '-' + index}>
                        <td className="data-table-cell">{isRecent && <span className="visually-hidden">최근 알람: </span>}{moment.unix(res.clock).format('YYYY-MM-DD HH:mm:ss')}</td>
                        <td className="data-table-cell">{res.severity}</td>
                        <td className="data-table-cell" title={res.hosts?.[0]?.host}>{res.hosts?.[0]?.host}</td>
                        <td className="data-table-cell" title={res.name}>{res.name}</td>
                      </tr>
                    );
                  })}
                  {!alarm.length && <tr className="data-table-row"><td className="data-table-cell" colSpan={4}>발생한 알람이 없습니다.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </aside>
      </UserFrame>
    </>
  );
}

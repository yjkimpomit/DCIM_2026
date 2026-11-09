"use client"
import { useEffect, useState } from 'react';
import ImmersionSvg from '@/_component/ImmersionSvg';
import { subscribeAlarmMonitor, subscribeImmersionMonitor, INTERVAL, SET_ALARM_RECENT } from '@/_lib/wsMonitor';
import moment from "moment";
import MiniGaugeChart from "@/_component/MiniGaugeChart";
import UserFrame from "@/_component/UserFrame";
import UserPageHeader from "@/_component/UserPageHeader";

// Power 게이지 표시 테스트. false로 변경하면 기존 실시간 수신값을 사용한다.
const USE_POWER_TEST_DATA = true;
const POWER_TEST_DATA = { total_power: 5.5, system_power: 0.1, server_power: 8.3 };

export default function Page() {
  const [data, setData] = useState({
    setpoint_temp: 43, //제공되지 않는 값
    actual_temp: 32.5, //제공되지 않는 값
    pue: 0,
    server_power: 0,
    system_power: 0,
    tank_temp: 0,
    tank_out_temp: 0,
    tank_in_temp: 0,
    total_power: 0,
    inverter_hz: 0,
    clooer_flow: 0,
    set_temp: 0,
    cooler_flow: 0,
    cooler_out_temp: 0,
    cooler_in_temp: 0,
    set_temp: 0,
    pressure: 0.17, //제공되지 않는 값
    cooler_power: 0.4, //제공되지 않는 값
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

  const powerData = USE_POWER_TEST_DATA ? POWER_TEST_DATA : data;
  const panels = [
    {
      title: "TOTAL POWER", value: powerData.total_power, max: 55.0, color: "orange",
      fields: [["PUE", pue], ["TANK INLET", tank_in_temp + "°C"], ["SETPOINT TEMP", set_temp + "°C"]],
    },
    {
      title: "SYSTEM POWER", value: powerData.system_power, max: 5.0, color: "cyan",
      fields: [["TANK TEMP", tank_temp + "°C"], ["TANK OUTLET", tank_out_temp + "°C"], ["INVERTER SETUP", inverter_hz + "Hz"]],
    },
    {
      title: "SERVER POWER", value: powerData.server_power, max: 50.0, color: "lime",
      fields: [["TANK INLET", tank_in_temp + "°C"], ["PRESSURE", pressure + "bar"], ["ALARM", alarm.length + "건"]],
    },
  ];

  return (
    <>
      <UserFrame active="immersion-process" screenClassName="user-live-screen">
        <main className="user-viewer user-live-viewer">
          <UserPageHeader title="프로세스 구성도" section="immersion" />
          <div className="user-model immersion-process-viewer immersion-live-model">
            <ImmersionSvg data={data} className="immersion-live-diagram" />
          </div>
        </main>
        <aside id="immersionDashboard" className="user-summary immersion-summary" aria-label="액침냉각 운전 정보">
          {panels.map(({ title, value, max, color, fields }) => (
            <section className="user-summary-section" key={title}>
              <h2 className="user-summary-title">{title}</h2>
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
          <section className="user-summary-section immersion-alarm-preview">
            <div className="user-card-heading">
              <h2 className="user-summary-title">알람</h2>
              <a className="user-card-button button-icon button-icon-add" href="/immersion-alarms" aria-label="알람 전체 보기" />
            </div>
            <div className="table-scroll user-table-scroll" tabIndex={0} role="region" aria-label="실시간 액침냉각 알람">
              <table className="data-table user-table user-table-compact immersion-alarm-table">
                <caption className="visually-hidden">알람 발생시각, TAG, TAG 설명, 메시지</caption>
                <thead>
                  <tr className="data-table-row">
                    <th className="data-table-heading" scope="col">발생시각</th>
                    <th className="data-table-heading" scope="col">TAG</th>
                    <th className="data-table-heading" scope="col">TAG Exp.</th>
                    <th className="data-table-heading" scope="col">메시지</th>
                  </tr>
                </thead>
                <tbody>
                  {alarm.map((res, index) => {
                    const isRecent = moment.unix(res.clock).isAfter(moment().subtract(SET_ALARM_RECENT, 'minutes'));
                    return (
                      <tr className="data-table-row" key={res.eventid || res.clock + '-' + index}>
                        <td className="data-table-cell">
                          {isRecent && <span className="visually-hidden">최근 알람: </span>}
                          {moment.unix(res.clock).format('YYYY-MM-DD HH:mm:ss')}
                        </td>
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

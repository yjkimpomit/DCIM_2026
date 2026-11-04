"use client"
import { useEffect, useState } from 'react';
import ImmersionSvg from '@/_component/ImmersionSvg';
import { subscribeAlarmMonitor, subscribeImmersionMonitor, INTERVAL, SET_ALARM_RECENT } from '@/_lib/wsMonitor';
import moment from "moment";
import GaugeChart from "@/_component/GaugeChart";
import PageFrame from '@/_component/PageFrame';
import AlarmModal from '@/_component/AlarmModal';

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
  const [recent, setRecent] = useState(0);
  const [isOpen, setOpen] = useState(false);

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

  const { pressure, pue, tank_in_temp, tank_temp, tank_out_temp, inverter_hz, cooler_flow, set_temp, server_power, system_power, total_power } = data;

  return (

    <div>
      <PageFrame
        setRecent={setRecent}
        recent={recent}
        setOpen={setOpen}
      />


      <div className="monitoring-immersion">
        <div className="immersion-box">
          <ImmersionSvg
            data={data} className="immersion-svg" />
          {/* <img src="/images/immersion.svg" className="immersion-svg"/> */}
        </div>

        <div id="immersionDashboard" className="dashboard immersion">
          <section className="section sec-8">
            <div className="info-box">
              <h2 className="info-title">Total Power</h2>
              <dl className="dl-detail">
                <dt>PUE</dt>
                <dd className="value">{pue}</dd>
                <dt>Pressure*</dt>
                <dd className="value">{pressure}<small className="unit">bar</small></dd>
                <dt>ALARM</dt>
                <dd className="value">{alarm.length}<small className="unit">건</small></dd>
              </dl>
            </div>
            <div className="chart-box gauge">
              {/* <!-- rotate 의 값은 chart-gauge.js 에서 계산된 angle 값을 대입한 결과입니다. 콘솔 참고 --> */}
              <div className="pointer-1" style={{
                transform: "translate(-50%, -50%) rotate(150deg)",
                transition: "transform 300ms cubic-bezier(.22,.61,.36,1)", "willChange": "transform"

              }}></div>
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

          <section className="section sec-9">
            <div className="info-box">
              <h2 className="info-title">System Power</h2>
              <dl className="dl-detail">
                <dt>Setpoint Temp</dt>
                <dd className="value">{set_temp}<small className="unit">℃</small></dd>
                <dt>Inlet Flow(tank)</dt>
                <dd className="value">{cooler_flow}<small className="unit">LPM</small></dd>
                <dt>Inverter Setup</dt>
                <dd className="value">{inverter_hz}<small className="unit">Hz</small></dd>
              </dl>
            </div>
            <div className="chart-box gauge">
              {/* <!-- rotate 의 값은 chart-gauge.js 에서 계산된 angle 값을 대입한 결과입니다. 콘솔 참고 --> */}
              <div className="pointer-2" style={{
                transform: "translate(-50%, -50%) rotate(150deg)",
                transition: "transform 300ms cubic-bezier(.22,.61,.36,1)", "willChange": "transform"
              }}></div>
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

          <section className="section sec-10">
            <div className="info-box">
              <h2 className="info-title">Server Power</h2>
              <dl className="dl-detail">
                <dt>Tank Temp</dt>
                <dd className="value">{tank_temp}<small className="unit">℃</small></dd>
                <dt>Tank Inlet</dt>
                <dd className="value">{tank_in_temp}<small className="unit">℃</small></dd>
                <dt>Tank Outlet</dt>
                <dd className="value">{tank_out_temp}<small className="unit">℃</small></dd>
              </dl>
            </div>
            <div className="chart-box gauge">
              {/* <!-- rotate 의 값은 chart-gauge.js 에서 계산된 angle 값을 대입한 결과입니다. 콘솔 참고 --> */}
              <div className="pointer-3" style={{
                transform: "translate(-50%, -50%) rotate(150deg)",
                transition: "transform 300ms cubic-bezier(.22,.61,.36,1)", "willChange": "transform"
              }}></div>
              <div id="gauge-3" className="chart-gauge">
                <GaugeChart
                  container={"gauge-3"}
                  pointer={"pointer-3"}
                  title={"SERVER POWER"}
                  value={server_power}
                  max={5.0}
                  unit={"kW"}
                  color={"#FFFC00"}
                />
              </div>
            </div>
          </section>

          {/* <!-- 알람 / 이벤트 로그 --> */}
          <section className="section sec-12">
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
              <div className="list-body">
                {alarm?.map((res, idx) => {
                  //set new alarm in 10min.
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

            </div>
          </section>

        </div>
      </div>
      <AlarmModal alarm={alarm} setAlarm={setAlarm} type={"immersion"} isOpen={isOpen} setOpen={setOpen} />
    </div>

  );
}

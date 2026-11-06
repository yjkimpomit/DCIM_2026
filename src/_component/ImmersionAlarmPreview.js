const alarms = [
  ["10:00:22", "#00", "AI Server", "DISK 사용률 임계값 초과"],
  ["10:03:29", "#01", "Rack Server", "GPU 사용률 임계값 초과"],
  ["10:06:36", "#02", "GPU Server", "네트워크 연결 확인"],
  ["10:09:15", "#03", "AI Server", "업데이트 점검 요청"],
  ["10:12:22", "#04", "DB Server", "DB 응답 지연"],
];

export default function ImmersionAlarmPreview() {
  return (
    <section className="room-summary-section immersion-alarm-preview">
      <div className="room-card-heading"><h2 className="room-summary-title">알람</h2><a className="room-card-button button-icon button-icon-add" href="/publishing/server-alarms" aria-label="알람 전체 보기"></a></div>
      <div className="room-table-scroll">
        <table className="room-table room-table-compact immersion-alarm-table">
          <caption className="visually-hidden">알람 발생시각, TAG, TAG 설명, 메시지</caption>
          <thead><tr><th scope="col">발생시각</th><th scope="col">TAG</th><th scope="col">TAG Exp.</th><th scope="col">메시지</th></tr></thead>
          <tbody>{alarms.map(([time, tag, target, message]) => <tr key={tag}><td>2025-09-12 {time}</td><td>{tag}</td><td>{target}</td><td title={message}>{message}</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

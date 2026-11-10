import moment from "moment";
import PanelHeading from "./PanelHeading";
import { SET_ALARM_RECENT } from "@/_lib/wsMonitor";

export default function LiveAlarmPanel({ alarms = [], moreHref, title = "알람", as = "h2", regionLabel = "실시간 액침냉각 알람" }) {
	const recentThreshold = moment().subtract(SET_ALARM_RECENT, "minutes");

	return (
		<section className="panel-section user-summary-section live-alarm-panel">
			<PanelHeading
				as={as}
				title={title}
				titleClassName="user-summary-title"
				className="panel-heading-summary"
				actions={moreHref && (
					<a className="user-card-button button-icon button-icon-add" href={moreHref} aria-label={`${title} 전체 보기`} />
				)}
			/>
			<div className="table-scroll user-table-scroll live-alarm-scroll" tabIndex={-1} role="region" aria-label={regionLabel}>
				<table className="data-table user-table user-table-compact live-alarm-table">
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
						{alarms.map((alarm, index) => {
							const occurredAt = moment.unix(alarm.clock);
							const host = alarm.hosts?.[0]?.host;

							return (
								<tr className="data-table-row" key={alarm.eventid || `${alarm.clock}-${index}`}>
									<td className="data-table-cell">
										{occurredAt.isAfter(recentThreshold) && <span className="visually-hidden">최근 알람: </span>}
										{occurredAt.format("YYYY-MM-DD HH:mm:ss")}
									</td>
									<td className="data-table-cell">{alarm.severity}</td>
									<td className="data-table-cell" title={host}>{host}</td>
									<td className="data-table-cell" title={alarm.name}>{alarm.name}</td>
								</tr>
							);
						})}
						{!alarms.length && (
							<tr className="data-table-row">
								<td className="data-table-cell" colSpan={4}>발생한 알람이 없습니다.</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</section>
	);
}

"use client"
import { Suspense } from "react";
import { closePopup } from "@/_lib/common"
import { useEffect, useState, useMemo } from "react"
import { loadAlarmList } from "@/_api";
import { useSearchParams } from "next/navigation";
import moment from 'moment';
import Pagination from "@/_component/Pagination";

export default function Page(){
	return(
		<Suspense> 
			{/*useSearchParams 사용하기위해서 */}
			<AlarmList/>
		</Suspense>
	)
}


export function AlarmList() {
	const [alarm, setAlarm] = useState([]);
	const [page, setPage] = useState(0);
	const pageSize = 5;
	const slice = useMemo(() => {
	const start = page * pageSize; 
	return alarm.slice(start, start + pageSize);
	}, [alarm, page, pageSize]);
	const [type,setType] = useState('');
	const sp = useSearchParams();

	useEffect(() => {
		const type = sp.get("type") ?? "immersion";
		setType(type);

		let cancelled = false;
		(async () => {
			try {
				const res = await loadAlarmList(type);
				if (!cancelled) {
					setAlarm(res)
				};
			} catch (e) {
				console.error('loadAlarmList failed:', e);
			}
		})();

		return () => { cancelled = true; };
	}, []);

	return (
		<div id="popup" className="popup">
			<div className="popup-dialog">
				<div id="popupContent" className="popup-content">
					<div className="popup-header">
						<h1 className="title-01">Alarm List</h1>
						<span className="popup-close" onClick={() => { closePopup() }} title="닫기"></span>
					</div>
					<div className="popup-body">
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

								{slice?.map((res, idx) => {
									//set recent alarm in 10min.
									const isRecent = moment.unix(res.clock).isAfter(moment().subtract(10, 'minutes'));
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
						<Pagination
							totalItems={alarm?.length}
							pageSize={pageSize}
							page={page}
							onChange={setPage}
							pageCount={5}             
						/>
					</div>

					<div className="popup-footer">
						<div className="button-group">
							<button className="btn btn-primary" onClick={() => { closePopup() }}> 닫기 </button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
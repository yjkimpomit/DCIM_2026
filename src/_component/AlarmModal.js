"use client"
import { useEffect, useState, useMemo,useRef } from "react"
import { loadAlarmList } from "@/_api";
import moment from 'moment';
import Pagination from "@/_component/Pagination";

export default function AlarmModal(props) {
	const { type, setOpen, isOpen } = props;
	const modalRef = useRef(null);
	const [alarm, setAlarm] = useState([]);
	const [page, setPage] = useState(0);
	const pageSize = 5;

	const slice = useMemo(() => {
		const start = page * pageSize;
		return alarm.slice(start, start + pageSize);
	}, [alarm, page, pageSize]);

	useEffect(() => {

		let cancelled = false;
		(async () => {
			try {
				const res = await loadAlarmList(type);
				if (!cancelled) {
					setAlarm(res)
					setPage(0)
				};
			} catch (e) {
				console.error('loadAlarmList failed:', e);
			}
		})();

		return () => { cancelled = true; };
	}, []);

	/**
	 * 모달이 열릴 때
	 */
	useEffect(() => {
		if (isOpen) {
			setPage(0);
			const onDocClick = (e) => {
				// 모달 바깥 클릭만 닫기
				if (!modalRef.current?.contains(e.target)) setOpen(false);
			};

			document.addEventListener('click', onDocClick, true);
			return () => document.removeEventListener('click', onDocClick, true);
		}
	}, [isOpen]);

	//스크롤 막음.
	useEffect(() => {
		const root = document.documentElement;
		if (isOpen) root.classList.add("no-scroll");
		return () => root.classList.remove("no-scroll");
	}, [isOpen]);

	return (
		<>
			<div className={`modal ${isOpen ? 'active' : ''}`}>

				<div className="modal-inner" ref={modalRef}>
					<div className="popup-dialog">
						<div id="popupContent" className="popup-content">
							<div className="popup-header">
								<h1 className="title-01">Alarm List</h1>
								<span className="popup-close" onClick={() => { setOpen(false); }} title="닫기"></span>
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
							</div>

							<div className="popup-footer">
								<Pagination
									totalItems={alarm?.length}
									pageSize={pageSize}
									page={page}
									onChange={setPage}
									pageCount={5}
								/>
								<div className="button-group">
									<button className="btn btn-primary" onClick={() => { setOpen(false) }}> 닫기 </button>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</>
	)
}
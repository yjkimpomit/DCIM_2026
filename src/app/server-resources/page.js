"use client";

import PanelHeading from "@/_component/PanelHeading";

import { useState } from "react";
import Pagination from "@/_component/Pagination";
import UserFrame from "@/_component/UserFrame";
import UserPageHeader from "@/_component/UserPageHeader";
import ResourceMeterChart from "@/_component/ResourceMeterChart";

const servers = Array.from({ length: 20 }, (_, index) => ({
	name: `SRV-${String(index + 1).padStart(3, "0")}`,
	address: `192.168.10.${101 + index}`,
	maintenance: index === 1 || index === 3,
}));

export default function ServerResourcesPublishing() {
	const [page, setPage] = useState(0);


	return (
		<UserFrame active="computing">
			<main className="user-viewer user-page-content">
				<UserPageHeader title="컴퓨팅 리소스" />
				<div className="user-page-body user-computing-grid">
					<div className="user-detail-sidebar">
						<label className="visually-hidden" htmlFor="server-room">
							서버실 선택
						</label>
						<select
							className="form-select user-location-select"
							id="server-room"
							defaultValue="pomit"
						>
							<option value="pomit">포미트 서버실</option>
						</select>
						<section className="panel-card user-detail-card">
							<PanelHeading as="h3" title="서버현황" />
							<dl className="user-server-counts user-server-counts-stacked">
								<div className="user-server-status user-server-normal">
									<dt>정상</dt>
									<dd>18대</dd>
								</div>
								<div className="user-server-status user-server-warning">
									<dt>점검</dt>
									<dd>2대</dd>
								</div>
							</dl>
						</section>
						<section className="panel-card user-detail-card">
							<PanelHeading as="h3" title="사용현황" />
							<div className="user-usage-meters">
								<ResourceMeterChart
									label="CPU 사용률(전체)"
									value={75}
									color="usage"
								/>
								<ResourceMeterChart
									label="GPU 사용률(전체)"
									value={56}
									color="usage"
								/>
								<ResourceMeterChart
									label="메모리 사용률(전체)"
									value={52}
									color="usage"
								/>
								<ResourceMeterChart
									label="디스크 사용률(전체)"
									value={42}
									color="usage"
								/>
							</div>
						</section>
					</div>

					<section
						className="user-results"
						aria-labelledby="resource-results-title"
					>
						<h3
							className="user-panel-title user-results-title"
							id="resource-results-title"
						>
							조회결과 <small>({servers.length}건)</small>
						</h3>
						<div
							className="table-scroll user-table-scroll"
							tabIndex={-1}
							role="region"
							aria-label="서버별 컴퓨팅 리소스 목록"
						>
							<table className="data-table user-table user-resource-table">
								<caption className="visually-hidden">
									서버별 CPU, GPU, 메모리, 디스크 사용률과 상태
								</caption>
								<thead>
									<tr className="data-table-row">
										<th className="data-table-heading" scope="col">서버명</th>
										<th className="data-table-heading" scope="col">CPU</th>
										<th className="data-table-heading" scope="col">GPU</th>
										<th className="data-table-heading" scope="col">메모리</th>
										<th className="data-table-heading" scope="col">디스크</th>
										<th className="data-table-heading" scope="col">상태</th>
									</tr>
								</thead>
								<tbody>
									{servers.slice(page * 10, (page + 1) * 10).map((server) => (
										<tr className="data-table-row" key={server.name}>
											<th className="data-table-cell" scope="row">
												{server.name}({server.address})
											</th>
											<td className="data-table-cell">75%</td>
											<td className="data-table-cell">56%</td>
											<td className="data-table-cell">52%</td>
											<td className="data-table-cell">42%</td>
											<td className="data-table-cell">
												<span
													className={`badge badge-${server.maintenance ? "warning" : "primary"} badge-solid badge-md`}
												>
													{server.maintenance ? "점검" : "정상"}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<Pagination totalItems={servers.length} pageSize={10} page={page} onChange={setPage} ariaLabel="서버 목록 페이지" />
					</section>
				</div>
			</main>
		</UserFrame>
	);
}

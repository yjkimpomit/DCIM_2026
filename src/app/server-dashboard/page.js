"use client";

import { useRef, useState } from "react";
import CctvModal from "@/_component/CctvModal";
import PanelHeading from "@/_component/PanelHeading";
import ResourceMeterChart from "@/_component/ResourceMeterChart";
import UserFrame from "@/_component/UserFrame";
import UserPageHeader from "@/_component/UserPageHeader";

export default function ServerDashboardPublishing() {
	return (
		<UserFrame>
			<main className="user-viewer user-viewer-overlay">
				<UserPageHeader title="대시보드" />
				<div className="user-model">

					{/* 모델뷰어에서 CCTV 아이콘을 클릭하면 열리는 팝업을 위한 임시버튼입니다. 실제 개발시 제거해 주세요. */}
					<CctvPreviewButton />

					{/* 실제 개발 시 src를 서버룸 뷰어 주소로 교체. 현재는 이미지가 포함된 임시 화면. */}
					<iframe
						className="user-model-frame"
						src="/__sample/server-room-viewer.html"
						title="서버룸 장비 배치 뷰어"
						width={1143}
						height={777}
						allowFullScreen
					/>
				</div>
			</main>

			<aside className="user-summary" aria-label="서버룸 현황">
				<section className="panel-section user-summary-section">
					<PanelHeading as="h2" title={<>서버</>} titleClassName="user-summary-title" className="panel-heading-summary" />
					<dl className="user-server-counts">
						<div className="user-server-status user-server-normal">
							<dt>정상</dt>
							<dd>18건</dd>
						</div>
						<div className="user-server-status user-server-warning">
							<dt>점검</dt>
							<dd>2건</dd>
						</div>
					</dl>
				</section>
				<section className="panel-section user-summary-section">
					<PanelHeading as="h2" title={<>환경</>} titleClassName="user-summary-title" className="panel-heading-summary" />
					<dl className="panel-card user-environment">
						<div className="user-environment-row">
							<dt>온도</dt>
							<dd className="user-environment-value">22.6°C</dd>
							<dd>
								<span className="badge badge-primary badge-solid badge-sm">
									정상
								</span>
							</dd>
						</div>
						<div className="user-environment-row">
							<dt>습도</dt>
							<dd className="user-environment-value">55.2%</dd>
							<dd>
								<span className="badge badge-primary badge-solid badge-sm">
									정상
								</span>
							</dd>
						</div>
					</dl>
				</section>
				<section className="panel-section user-summary-section">
					<PanelHeading as="h2" title={<>컴퓨팅 리소스(전체)</>} titleClassName="user-summary-title" className="panel-heading-summary" />
					<div className="panel-card user-resource-list">
						<ResourceMeterChart label="CPU" value={75} color="usage" />
						<ResourceMeterChart label="GPU" value={56} color="usage" />
						<ResourceMeterChart label="메모리" value={52} color="usage" />
						<ResourceMeterChart label="디스크" value={42} color="usage" />
					</div>
				</section>
				<section className="panel-section user-summary-section">
					<PanelHeading as="h2" title={<>전력사용량</>} titleClassName="user-summary-title" className="panel-heading-summary" />
					<div className="panel-card user-power">
						<dl className="user-power-value">
							<dt>오늘</dt>
							<dd>158.7kw</dd>
						</dl>
						{/* 증감 표시: 증가 trending_up.svg / 감소 trending_down.svg. 변경 시 aria-label도 함께 수정 */}
						<span
							className="user-power-trend"
							role="img"
							aria-label="어제보다 증가"
						>
							<img
								className="user-icon"
								src="/images/icons/trending_up.svg"
								alt=""
								width={24}
								height={24}
							/>
						</span>
						{/* 감소 시 사용:
                <span className="user-power-trend" role="img" aria-label="어제보다 감소"><img className="user-icon" src="/images/icons/trending_down.svg" alt="" width={24} height={24} /></span>
                */}
						<dl className="user-power-value user-power-previous">
							<dt>어제</dt>
							<dd>157.2kw</dd>
						</dl>
					</div>
				</section>
				<section className="panel-section user-summary-section">
					<PanelHeading as="h2" title={<>UPS</>} titleClassName="user-summary-title" className="panel-heading-summary" />
					<div className="panel-card user-resource-list">
						<ResourceMeterChart label="배터리" value={92} color="cyan" />
						<ResourceMeterChart label="부하율" value={68} color="red" />
						<dl className="user-ups-history">
							<dt>전환이력</dt>
							<dd>
								<time dateTime="2026-10-18T03:24">2026-10-18 03:24</time>
							</dd>
						</dl>
					</div>
				</section>
			</aside>
		</UserFrame>
	);
}

const camera = { id: "CCTV-SRV-001", label: "출입구", image: "/__sample/images/cctv01.jpg", viewerUrl: "", isError: false };

function CctvPreviewButton() {
	const [isOpen, setIsOpen] = useState(false);
	const buttonRef = useRef(null);

	function closePopup() {
		setIsOpen(false);
	}

	return (
		<>
			{/* 퍼블리싱 확인용 임시 버튼. 실제 CCTV 위치 버튼 연결 후 제거. */}
			<button ref={buttonRef} type="button" className="btn btn-primary btn-sm user-model-cctv" aria-haspopup="dialog" onClick={() => setIsOpen(true)}>CCTV 팝업 (임시)</button>
			{isOpen && <CctvModal camera={camera} onClose={closePopup} returnFocusRef={buttonRef} />}
		</>
	);
}

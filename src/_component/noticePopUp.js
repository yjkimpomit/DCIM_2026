"use client";
import { closePopup } from "@/_lib/common";


export default function NoticePopUp(){
    return(
        <div id="popup" className="popup">
       	<div className="popup-dialog">
		<div id="popupContent" className="popup-content">
			<div className="popup-header">
				<h1 className="title-01">공지</h1>
				<span className="popup-close" onClick={()=>{closePopup();}} title="닫기"></span>
			</div>
			<div className="popup-body">
				<div className="bg-img notice">
					<div className="title-box">
						<h2 className="title title-2">서비스 점검 안내</h2>
						<span className="badge badge-2">2025/10/28 00:00 ~ 06:00</span>
					</div>
					<p className="message">액침냉각 장비에 대한 최신 기술 적용과 최적화 작업이 진행 중입니다. 이에 따른 잠시 서비스 지연이 발생할 수 있으니 이해와 협조 부탁드립니다.</p>
				</div>
			</div>

			<div className="popup-footer">
				<div className="button-group">
					<button className="btn btn-primary" onClick={()=>{closePopup();}}> 닫기 </button>
				</div>
			</div>
		</div>
	</div>
      </div>

    )
}
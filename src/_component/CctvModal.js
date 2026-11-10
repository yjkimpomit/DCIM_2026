"use client";

import { useEffect, useRef, useState } from "react";
import Modal from "@/_component/Modal";

export default function CctvModal({ camera, onClose, returnFocusRef }) {
	const fullscreenRef = useRef(null);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [fullscreenSupported, setFullscreenSupported] = useState(false);
	const [fullscreenError, setFullscreenError] = useState("");

	useEffect(() => {
		const syncFullscreen = () => setIsFullscreen(document.fullscreenElement === fullscreenRef.current);
		setFullscreenSupported(Boolean(document.fullscreenEnabled && fullscreenRef.current?.requestFullscreen));
		document.addEventListener("fullscreenchange", syncFullscreen);
		return () => {
			document.removeEventListener("fullscreenchange", syncFullscreen);
		};
	}, []);

	async function toggleFullscreen() {
		setFullscreenError("");
		try {
			if (document.fullscreenElement === fullscreenRef.current) {
				await document.exitFullscreen();
			} else {
				await fullscreenRef.current.requestFullscreen();
			}
		} catch {
			setFullscreenError("전체화면 전환에 실패했습니다. 잠시 후 다시 시도해 주세요.");
		}
	}

	async function closePopup() {
		try {
			if (document.fullscreenElement === fullscreenRef.current) await document.exitFullscreen();
		} catch {
			// 전체화면 종료가 거절되어도 팝업은 닫을 수 있게 한다.
		}
		onClose();
	}

	return (
		<Modal
			className="user-cctv-popup"
			aria-labelledby="cctv-popup-title"
			onClose={closePopup}
			returnFocusRef={returnFocusRef}
			closeOnBackdrop
		>
			<div ref={fullscreenRef} className="user-cctv-popup-content">
				{/* 실제 개발 시 camera.viewerUrl에 외부 CCTV 뷰어 URL을 연결한다.
          주소가 없으면 iframe 안에 퍼블리싱용 샘플 이미지를 표시한다. */}
				<iframe
					className="user-cctv-popup-viewer"
					src={camera.viewerUrl || "about:blank"}
					srcDoc={camera.viewerUrl ? undefined : `<!doctype html><html lang="ko"><meta charset="utf-8"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden}img{display:block;width:100%;height:100%;object-fit:cover}</style><img src="${camera.image}" alt="CCTV 샘플 이미지"></html>`}
					title={`${camera.label} CCTV 뷰어`}
					width={960}
					height={540}
					allow="autoplay; fullscreen"
					allowFullScreen
				/>
				<h2 id="cctv-popup-title" className="user-cctv-caption">{camera.id}<span className={`user-cctv-status${camera.isError ? " user-cctv-status-error" : ""}`} role="img" aria-label={camera.isError ? "이상 발생" : "정상"}></span></h2>
				<div className="user-cctv-popup-controls" role="group" aria-label="CCTV 뷰어 제어">
					<button
						type="button"
						className="user-cctv-popup-fullscreen"
						aria-label={isFullscreen ? "전체화면 해제" : "전체화면 보기"}
						title={isFullscreen ? "전체화면 해제" : "전체화면 보기"}
						aria-pressed={isFullscreen}
						disabled={!fullscreenSupported}
						onClick={toggleFullscreen}
					>
					</button>
					<button type="button" className="user-cctv-popup-close" aria-label="CCTV 팝업 닫기" onClick={closePopup}></button>
				</div>
				{fullscreenError && <p className="user-cctv-fullscreen-error" role="status">{fullscreenError}</p>}
			</div>
		</Modal>
	);
}

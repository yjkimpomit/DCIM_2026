"use client";

import { useEffect, useRef } from "react";

export default function CctvModal({ camera, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => { dialog.close(); };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="room-cctv-popup"
      aria-labelledby="cctv-popup-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      {/* 실제 개발 시 camera.viewerUrl에 외부 CCTV 뷰어 URL을 연결한다.
          주소가 없으면 iframe 안에 퍼블리싱용 샘플 이미지를 표시한다. */}
      <iframe
        className="room-cctv-popup-viewer"
        src={camera.viewerUrl || "about:blank"}
        srcDoc={camera.viewerUrl ? undefined : `<!doctype html><html lang="ko"><meta charset="utf-8"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden}img{display:block;width:100%;height:100%;object-fit:cover}</style><img src="${camera.image}" alt="CCTV 샘플 이미지"></html>`}
        title={`${camera.label} CCTV 뷰어`}
        width={960}
        height={540}
        allow="autoplay; fullscreen"
        allowFullScreen
      />
      <h2 id="cctv-popup-title" className="room-cctv-caption">{camera.id}<span className={`room-cctv-status${camera.isError ? " room-cctv-status-error" : ""}`} role="img" aria-label={camera.isError ? "이상 발생" : "정상"}></span></h2>
      <button type="button" className="room-cctv-popup-close" aria-label="CCTV 팝업 닫기" onClick={onClose}></button>
    </dialog>
  );
}

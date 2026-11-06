"use client";

import { useRef, useState } from "react";
import CctvModal from "@/_component/CctvModal";

const camera = { id: "CCTV-SRV-001", label: "출입구", image: "/__sample/images/cctv01.jpg", viewerUrl: "", isError: false };

export default function CctvPreviewButton() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

  function closePopup() {
    setIsOpen(false);
    requestAnimationFrame(() => buttonRef.current?.focus());
  }

  return (
    <>
      {/* 퍼블리싱 확인용 임시 버튼. 실제 CCTV 위치 버튼 연결 후 제거. */}
      <button ref={buttonRef} type="button" className="btn btn-primary btn-sm room-model-cctv" aria-haspopup="dialog" onClick={() => setIsOpen(true)}>CCTV 팝업 (임시)</button>
      {isOpen && <CctvModal camera={camera} onClose={closePopup} />}
    </>
  );
}

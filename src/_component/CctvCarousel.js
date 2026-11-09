"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import CctvModal from "@/_component/CctvModal";
import "swiper/css";

const cameras = [
  // viewerUrl: 실제 외부 CCTV 뷰어 주소 연결 위치.
  // isError: false = 정상(녹색), true = 이상(빨간색). 두 번째 슬라이드는 이상 상태 예시.
  { id: "CCTV-SRV-001", label: "출입구", image: "/__sample/images/cctv01.jpg", viewerUrl: "", isError: false },
  { id: "CCTV-SRV-002", label: "서버실 내부", image: "/__sample/images/cctv02.jpg", viewerUrl: "", isError: true },
  { id: "CCTV-SRV-003", label: "서버실 통로", image: "/__sample/images/cctv03.jpg", viewerUrl: "", isError: false },
];

export default function CctvCarousel() {
  const [slider, setSlider] = useState(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(cameras.length <= 2);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const triggerRef = useRef(null);

  function closeCamera() {
    setSelectedCamera(null);
  }

  function updateButtons(swiper) {
    setAtStart(swiper.isBeginning || swiper.isLocked);
    setAtEnd(swiper.isEnd || swiper.isLocked);
  }

  return (
    <section className="user-cctv-section" aria-label="CCTV" aria-roledescription="캐러셀">
      <div className="user-card-heading">
        <h4 className="user-section-title">CCTV</h4>
        <div className="user-cctv-controls">
          <button type="button" className="user-card-button button-icon button-icon-previous" aria-label="이전 CCTV" aria-controls="room-cctv-slider" disabled={atStart} onClick={() => slider?.slidePrev()}>
          </button>
          <button type="button" className="user-card-button button-icon button-icon-next" aria-label="다음 CCTV" aria-controls="room-cctv-slider" disabled={atEnd} onClick={() => slider?.slideNext()}>
          </button>
        </div>
      </div>
      <Swiper
        id="room-cctv-slider"
        className="user-cctv-slider"
        modules={[A11y]}
        slidesPerView={2}
        slidesPerGroup={1}
        spaceBetween={24}
        loop={false}
        watchOverflow
        a11y={{ slideLabelMessage: "전체 {{slidesLength}}개 중 {{index}}번째 CCTV" }}
        onSwiper={(swiper) => { setSlider(swiper); updateButtons(swiper); }}
        onSlideChange={updateButtons}
        onResize={updateButtons}
      >
        {cameras.map(({ id, label, image, viewerUrl, isError }) => (
          <SwiperSlide key={image}>
            <figure className="user-cctv">
              <button type="button" className="user-cctv-open" aria-label={`${label} CCTV 확대 보기`} aria-haspopup="dialog" onClick={(event) => { triggerRef.current = event.currentTarget; setSelectedCamera({ id, label, image, viewerUrl, isError }); }}>
                <img className="user-cctv-image" src={image} alt="" width={240} height={135} />
              </button>
              {/* 정상: user-cctv-status / 이상: user-cctv-status user-cctv-status-error */}
              <figcaption className="user-cctv-caption">{label}<span className={`user-cctv-status${isError ? " user-cctv-status-error" : ""}`} role="img" aria-label={isError ? "이상 발생" : "정상"}></span></figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
      {selectedCamera && <CctvModal camera={selectedCamera} onClose={closeCamera} returnFocusRef={triggerRef} />}
    </section>
  );
}

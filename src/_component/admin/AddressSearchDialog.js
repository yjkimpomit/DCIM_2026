"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import AdminDialog from "./AdminDialog";

export default function AddressSearchDialog({ onClose, onSelect }) {
  const containerRef = useRef(null);
  const onSelectRef = useRef(onSelect);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

  useEffect(() => {
    if (!ready) return;
    const container = containerRef.current;
    const Postcode = window.kakao?.Postcode || window.daum?.Postcode;
    if (!container || !Postcode) {
      setError("주소 검색을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    let active = true;
    try {
      // 외부 iframe에는 CSS 변수를 직접 전달할 수 없어 현재 토큰의 색상값을 사용한다.
      const styles = getComputedStyle(container);
      const color = (token) => styles.getPropertyValue(token).trim();
      new Postcode({
        width: "100%",
        height: "100%",
        theme: {
          bgColor: color("--table-th-bg"),
          searchBgColor: color("--bg-darknavy-muted"),
          contentBgColor: color("--table-th-bg"),
          pageBgColor: color("--bg-darknavy-subtler"),
          textColor: color("--fg-neutral-strong"),
          queryTextColor: color("--fg-neutral-strongest"),
          postcodeTextColor: color("--fg-primary-strong"),
          emphTextColor: color("--fg-primary-stronger"),
          outlineColor: color("--border-secondary-default"),
        },
        oncomplete(data) {
          if (!active) return;
          let address = data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;
          if (data.userSelectedType === "R") {
            const extra = [];
            if (data.bname && /[동로가]$/.test(data.bname)) extra.push(data.bname);
            if (data.buildingName && data.apartment === "Y") extra.push(data.buildingName);
            if (extra.length) address += ` (${extra.join(", ")})`;
          }
          onSelectRef.current({ postcode: data.zonecode, address });
        },
      }).embed(container);
    } catch {
      setError("주소 검색을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
    return () => { active = false; container.replaceChildren(); };
  }, [ready]);

  return (
    <AdminDialog title="주소 검색" onClose={onClose}>
      <Script src="https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="afterInteractive" onReady={() => setReady(true)} onError={() => setError("주소 검색을 불러오지 못했습니다. 인터넷 연결을 확인해 주세요.")} />
      {!ready && !error && <p className="admin-address-status" role="status">주소 검색을 불러오는 중입니다.</p>}
      {error && <p className="form-error admin-form-error" role="alert">{error}</p>}
      <div ref={containerRef} className="admin-postcode-embed" aria-label="카카오 우편번호 검색" hidden={Boolean(error)} />
      <div className="form-actions"><button className="btn btn-secondary btn-lg" type="button" onClick={onClose}>닫기</button></div>
    </AdminDialog>
  );
}

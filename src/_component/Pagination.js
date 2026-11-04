// Pagination.jsx (슬라이딩 윈도우)
import { useMemo } from "react";

export default function Pagination({
  totalItems,
  pageSize = 50,
  page = 0,               // 0-based
  onChange,
  pageCount = 5,          // 항상 이 개수(가능하면) 유지
  className = "pagination",
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const displayPage = page + 1; // 1-based

  // 슬라이딩 윈도우 계산
  const { first, last } = useMemo(() => {
    const windowSize = Math.min(pageCount, totalPages);             // 전체 페이지가 더 적으면 거기에 맞춤
    const half = Math.floor(windowSize / 2);

    // 기본 start는 현재 페이지를 중앙에 두도록
    let start = displayPage - half;

    // 페이지 수가 짝수일 때 현재 페이지가 약간 왼쪽에 치우치는 게 싫다면
    // start = displayPage - Math.ceil(windowSize / 2) + 1; 로 약간 조정 가능

    // 경계 보정
    if (start < 1) start = 1;
    if (start > totalPages - windowSize + 1) start = totalPages - windowSize + 1;

    const end = start + windowSize - 1;
    return { first: start, last: end };
  }, [displayPage, pageCount, totalPages]);

  const go = (p0) => {
    const nxt = Math.max(0, Math.min(p0, totalPages - 1));
    if (nxt !== page) onChange?.(nxt);
  };

  const numbers = [];
  for (let n = first; n <= last; n++) numbers.push(n); // 1-based 표시

  return (
    <div className={className} role="navigation" aria-label="Pagination">
      <button className="page first" onClick={() => go(0)} disabled={page === 0}>FIRST</button>
      <button className="page prev"  onClick={() => go(page - 1)} disabled={page === 0}>PREV</button>

      {numbers.map((n) => {
        const idx0 = n - 1;
        const current = idx0 === page;
        return (
          <button
            key={n}
            className={`page${current ? " current" : ""}`}
            onClick={() => go(idx0)}
            aria-current={current ? "page" : undefined}
          >
            {n}
          </button>
        );
      })}

      <button className="page next" onClick={() => go(page + 1)} disabled={page === totalPages - 1}>NEXT</button>
      <button className="page last" onClick={() => go(totalPages - 1)} disabled={page === totalPages - 1}>LAST</button>
    </div>
  );
}

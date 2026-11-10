"use client";

export default function Pagination({ totalItems, pageSize = 50, page = 0, onChange, pageCount = 5, className = "", ariaLabel = "목록 페이지" }) {
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const currentPage = Math.max(0, Math.min(page, totalPages - 1));
	const visibleCount = Math.min(pageCount, totalPages);
	const firstPage = Math.max(0, Math.min(currentPage - Math.floor(visibleCount / 2), totalPages - visibleCount));
	const pages = Array.from({ length: visibleCount }, (_, index) => firstPage + index);

	function go(nextPage) {
		const targetPage = Math.max(0, Math.min(nextPage, totalPages - 1));
		if (targetPage !== currentPage) onChange?.(targetPage);
	}

	return (
		<nav className={`pagination${className ? ` ${className}` : ""}`} aria-label={ariaLabel}>
			<button type="button" className="page first" aria-label="첫 페이지" onClick={() => go(0)} disabled={currentPage === 0}>FIRST</button>
			<button type="button" className="page prev" aria-label="이전 페이지" onClick={() => go(currentPage - 1)} disabled={currentPage === 0}>PREV</button>
			{pages.map((pageIndex) => (
				<button
					type="button"
					key={pageIndex}
					className={`page${pageIndex === currentPage ? " current" : ""}`}
					aria-label={`${pageIndex + 1}페이지`}
					aria-current={pageIndex === currentPage ? "page" : undefined}
					onClick={() => go(pageIndex)}
				>
					{pageIndex + 1}
				</button>
			))}
			<button type="button" className="page next" aria-label="다음 페이지" onClick={() => go(currentPage + 1)} disabled={currentPage === totalPages - 1}>NEXT</button>
			<button type="button" className="page last" aria-label="마지막 페이지" onClick={() => go(totalPages - 1)} disabled={currentPage === totalPages - 1}>LAST</button>
		</nav>
	);
}

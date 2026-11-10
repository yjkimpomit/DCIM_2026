export default function AdminPageHeader({
	title,
	section,
	homeHref = "/admin",
	homeLabel = "관리자 홈",
}) {
	return (
		<div className="admin-page-header">
			<h2 className="admin-page-title">{title}</h2>
			<nav aria-label="현재 위치">
				<ol className="admin-breadcrumb">
					<li>
						<a className="admin-breadcrumb-home" href={homeHref} aria-label={homeLabel} />
					</li>
					{section && <li className="admin-breadcrumb-item">{section}</li>}
					<li className="admin-breadcrumb-item" aria-current="page">{title}</li>
				</ol>
			</nav>
		</div>
	);
}

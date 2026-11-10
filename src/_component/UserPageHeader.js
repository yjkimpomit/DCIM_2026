export default function UserPageHeader({
	title,
	section = "SERVER ROOM MONITORING",
	homeHref = "/server-dashboard",
	homeLabel = "홈",
}) {
	return (
		<div className="user-page-header">
			<h2 className="user-page-title">{title}</h2>
			<nav aria-label="현재 위치">
				<ol className="user-breadcrumb">
					<li>
						<a className="user-breadcrumb-home" href={homeHref} aria-label={homeLabel} />
					</li>
					{section && <li className="user-breadcrumb-item">{section}</li>}
					<li className="user-breadcrumb-item" aria-current="page">{title}</li>
				</ol>
			</nav>
		</div>
	);
}

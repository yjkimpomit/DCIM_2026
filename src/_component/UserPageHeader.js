export default function UserPageHeader({ title, section = "server" }) {
  const isImmersion = section === "immersion";

  return (
    <div className="user-page-header">
      <h2 className="user-page-title">{title}</h2>
      <nav aria-label="현재 위치">
        <ol className="user-breadcrumb">
          <li><a className="user-breadcrumb-home" href={isImmersion ? "/immersion-dashboard" : "/server-dashboard"} aria-label="홈" /></li>
          <li className="user-breadcrumb-item"><span>{isImmersion ? "IMMERSION COOLING MONITORING" : "SERVER ROOM MONITORING"}</span></li>
          <li className="user-breadcrumb-item"><span aria-current="page">{title}</span></li>
        </ol>
      </nav>
    </div>
  );
}

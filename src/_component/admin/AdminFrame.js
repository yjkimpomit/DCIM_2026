import AdminHeader from "@/_component/admin/AdminHeader";
import AdminSidebar from "@/_component/admin/AdminSidebar";

export default function AdminFrame({ children, initialTime }) {
  return (
    <>
      <link rel="stylesheet" href="/css/admin/layout.css" />
      <link rel="stylesheet" href="/css/admin/components.css" />
      <link rel="stylesheet" href="/css/admin/content.css" />
      <div className="admin-screen">
        <a className="admin-skip-link" href="#admin-content">본문 바로가기</a>
        <AdminHeader initialTime={initialTime} />
        <div className="admin-layout">
          <AdminSidebar />
          <main className="admin-content" id="admin-content" tabIndex={-1}>{children}</main>
        </div>
      </div>
    </>
  );
}

"use client";

import { useId } from "react";
import Modal from "@/_component/Modal";

export default function AdminDialog({ title, onClose, children, compact = false }) {
  const titleId = useId();
  return (
    <Modal className={`admin-dialog${compact ? " admin-dialog-compact" : ""}`} aria-labelledby={titleId} onClose={onClose}>
      <div className={compact ? "visually-hidden" : "admin-dialog-header"}>
        <h3 id={titleId}>{title}</h3>
        {!compact && <button className="admin-dialog-close button-icon" type="button" onClick={onClose} aria-label="닫기" />}
      </div>
      <div className="admin-dialog-body">{children}</div>
    </Modal>
  );
}

export function AdminNotice({ children, onClose }) {
  return <AdminDialog title="알림" onClose={onClose} compact><p className="admin-notice-message">{children}</p><div className="form-actions"><button className="btn btn-primary" type="button" onClick={onClose} autoFocus>확인</button></div></AdminDialog>;
}

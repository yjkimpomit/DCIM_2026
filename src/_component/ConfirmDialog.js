"use client";

import { useId } from "react";
import Modal from "@/_component/Modal";

export default function ConfirmDialog({ message, confirmLabel = "확인", onConfirm, onCancel, fallbackFocusRef }) {
  const messageId = useId();

  return (
    <Modal className="confirm-dialog" aria-labelledby={messageId} onClose={onCancel} fallbackFocusRef={fallbackFocusRef}>
      <div className="confirm-dialog-body">
        <p className="confirm-dialog-message" id={messageId}>{message}</p>
        <div className="confirm-dialog-actions">
          <button className="btn btn-primary btn-md confirm-dialog-button" type="button" onClick={onConfirm}>{confirmLabel}</button>
          <button className="btn btn-secondary btn-md confirm-dialog-button" type="button" onClick={onCancel} autoFocus>취소</button>
        </div>
      </div>
    </Modal>
  );
}

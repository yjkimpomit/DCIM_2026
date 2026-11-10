"use client";

import { useEffect, useRef } from "react";

const modalStack = [];
let pendingFocus = [];

function restoreFocus() {
	const pending = pendingFocus;
	pendingFocus = [];
	const topModal = modalStack.at(-1)?.dialog;
	const canFocus = (element) => element?.isConnected && !element.disabled && element.getClientRects().length && (!topModal || topModal.contains(element));
	const active = document.activeElement;

	// 주소 선택 등에서 명시적으로 이동한 포커스는 유지한다.
	if (active !== document.body && canFocus(active) && !pending.some(({ dialog }) => dialog.contains(active))) return;

	for (const entry of pending.sort((first, second) => first.depth - second.depth)) {
		// Strict Mode의 재실행 또는 새 모달 열기와 충돌하지 않는다.
		if (modalStack.some(({ dialog }) => dialog === entry.dialog)) continue;
		const { returnFocusRef, fallbackFocusRef } = entry.focusOptions.current;
		const target = [returnFocusRef?.current, entry.trigger, fallbackFocusRef?.current].find(canFocus);
		if (target) {
			target.focus();
			break;
		}
	}
}

export default function Modal({ children, onClose, dialogRef: externalRef, initialFocusRef, returnFocusRef, fallbackFocusRef, closeOnBackdrop = false, ...props }) {
	const internalRef = useRef(null);
	const dialogRef = externalRef || internalRef;
	const focusOptions = useRef({ initialFocusRef, returnFocusRef, fallbackFocusRef });

	useEffect(() => {
		focusOptions.current = { initialFocusRef, returnFocusRef, fallbackFocusRef };
	}, [initialFocusRef, returnFocusRef, fallbackFocusRef]);

	useEffect(() => {
		const dialog = dialogRef.current;
		const entry = { dialog, trigger: document.activeElement, depth: modalStack.length, focusOptions };
		modalStack.push(entry);
		if (!dialog.open) dialog.showModal();
		focusOptions.current.initialFocusRef?.current?.focus();

		return () => {
			const index = modalStack.indexOf(entry);
			if (index !== -1) modalStack.splice(index, 1);
			if (dialog.open) dialog.close();
			pendingFocus.push(entry);
			if (pendingFocus.length === 1) queueMicrotask(restoreFocus);
		};
	}, [dialogRef]);

	function cancel(event) {
		event.preventDefault();
		event.stopPropagation();
		if (modalStack.at(-1)?.dialog === event.currentTarget) onClose?.();
	}

	return (
		<dialog {...props} ref={dialogRef} onCancel={cancel} onClick={closeOnBackdrop ? (event) => {
			if (event.target === event.currentTarget && modalStack.at(-1)?.dialog === event.currentTarget) {
				event.stopPropagation();
				onClose?.();
			}
		} : undefined}>
			{children}
		</dialog>
	);
}

import { useEffect } from "react";

/*
 * 포미트 : DCIM
 * 작성자 : 김윤지
 * 작성일 : 2025.09.24
 * 사용처 : 공통으로 사용하는 스크립트 모음
 */

// 새창팝업
// onclick="openPopup('popup.html', 960, 600);"
function openPopup(url, width = 480, height = 320) {

	// 현재 브라우저 창 위치
	const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
	const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

	// 현재 브라우저 뷰포트 크기
	const windowWidth = window.innerWidth || document.documentElement.clientWidth || screen.width;
	const windowHeight = window.innerHeight || document.documentElement.clientHeight || screen.height;

	// 팝업 위치 계산 (현재 브라우저 창 화면 중앙 기준)
	const left = dualScreenLeft + Math.max(0, Math.floor((windowWidth - width) / 2));
	const top = dualScreenTop + Math.max(0, Math.floor((windowHeight - height) / 2));

	window.open(
		url,
		'_blank',
		`width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
	);
}

// 하나의 html 로 모달과 새창팝업 같이 띄우기 
function openModal(url, width, height) {
	// 모달 요소가 없으면 생성
	if (!document.getElementById('modal')) {
		const modal = document.createElement('div');
		modal.id = 'modal';
		modal.classList.add('modal-popup');

		const modalDialog = document.createElement('div');
		modalDialog.id = 'modalDialog';
		modalDialog.classList.add('modal-dialog');

		const modalContent = document.createElement('div');
		modalContent.id = 'modalContent';
		modalContent.classList.add('modal-content');

		modal.appendChild(modalDialog);
		modalDialog.appendChild(modalContent);
		document.body.appendChild(modal);

		// 모달 백드롭(외부) 클릭 시 닫기 이벤트 추가
		modal.addEventListener('click', function (event) {
			// 만약 클릭한 곳이 modalContent 내부라면 닫기 무시
			if (modalContent.contains(event.target)) {
				return;
			}
			closePopup();
		});
	}

	// 모달 내용 로드 및 표시
	fetch(url)
		.then(response => response.text())
		.then(html => {
			const modal = document.getElementById('modal');
			const modalDialog = document.getElementById('modalDialog');

			modalDialog.style.width = width + 'px';
			modalDialog.style.height = height + 'px';
			modal.style.display = 'flex';

			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');
			const modalContent = doc.getElementById('popupContent').innerHTML;
			document.getElementById('modalContent').innerHTML = modalContent;
		});
}

// 모달인지 새창팝업인지 체크하여 닫기버튼 실행
function closePopup() {
	const modal = document.getElementById('modal');
	const popup = document.getElementById('popup');
	if (modal) {
		modal.remove();
	} else if (popup) {
		window.close();
	}
}

/* 새창/모달 팝업 테스트용 버튼 : 
	<div class="test-popup">
		<button class="btn btn-sm btn-outline" onclick="openModal('notice_popup.html', 800, 360);" title="모달팝업 열기">모달팝업</button>
		<button class="btn btn-sm btn-outline" onclick="openPopup('notice_popup.html', 800, 360);" title="새창팝업 열기">새창팝업</button>
	</div>
*/

// 전체화면
function initFullScreenBtn() {
	const elem = document.documentElement;
	const btn = document.getElementById('toggleFullscreenBtn');
	const spanElement = btn.querySelector('span');

	// 전체화면 상태 변경 이벤트에 따라 버튼 텍스트 변경
	document.addEventListener('fullscreenchange', () => {
		if (document.fullscreenElement) {
			btn.classList.add('fs-off');
			btn.classList.remove('fs-on');
			document.body.classList.add('fs-mode');
			spanElement.textContent = '전체화면 해제';
		} else {
			btn.classList.add('fs-on');
			btn.classList.remove('fs-off');
			document.body.classList.remove('fs-mode');
			spanElement.textContent = '전체화면모드';
		}
	});

	btn.addEventListener('click', toggleFullscreen);

	function toggleFullscreen() {
		if (!document.fullscreenElement) {
			// 전체화면 아니면 전체화면으로 전환
			if (elem.requestFullscreen) {
			 elem.requestFullscreen().catch((e)=>{console.log(e);});
			} else 
			if (elem.webkitRequestFullscreen) {
				elem.webkitRequestFullscreen();
			} else if (elem.msRequestFullscreen) {
				elem.msRequestFullscreen();
			}
		} else {
			// 전체화면이면 해제
			if (document.exitFullscreen) {
				document.exitFullscreen().catch((e)=>{console.log(e);});
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
		}
	}

}


export {
	openPopup,
	closePopup,
	initFullScreenBtn
}
// app/_lib/wsMonitor.js
export const INTERVAL = 8000;
export const SET_ALARM_RECENT = 10; //10분

export function subscribeServerMonitor({ interval = INTERVAL, onData, onError } = {}) {
	const base = (process.env.NEXT_PUBLIC_SOCKET_BACKEND).replace(/^http/, 'ws');
	const url = `${base}/ws/server-monitor`;
	const ws = new WebSocket(url);

	ws.onopen = () => ws.send(JSON.stringify({ type: 'subscribe', interval }));
	ws.onmessage = (e) => {
		try {
			const msg = JSON.parse(e.data);

			if (msg.type === 'server-monitor') onData && onData(msg, msg.ts);
			else if (msg.type === 'error') onError && onError(new Error(msg.message));
		} catch (err) { onError && onError(err); }
	};
	ws.onerror = (e) => onError && onError(e);

	return ws;
}


export function subscribeImmersionMonitor({ interval = INTERVAL, onData, onError } = {}) {
	const base = (process.env.NEXT_PUBLIC_SOCKET_BACKEND).replace(/^http/, 'ws');
	const url = `${base}/ws/immersion-monitor`;
	const ws = new WebSocket(url);

	ws.onopen = () => ws.send(JSON.stringify({ type: 'subscribe', interval }));
	ws.onmessage = (e) => {
		try {
			const msg = JSON.parse(e.data);

			if (msg.type === 'immersion-monitor') onData && onData(msg, msg.ts);
			else if (msg.type === 'error') onError && onError(new Error(msg.message));
		} catch (err) { onError && onError(err); }
	};
	ws.onerror = (e) => onError && onError(e);

	return ws;
}

export function subscribeAlarmMonitor({ interval = INTERVAL, host_type, onData, onError } = {}) {
	const base = (process.env.NEXT_PUBLIC_SOCKET_BACKEND).replace(/^http/, 'ws');
	const url = `${base}/ws/alarm-monitor?host_type=${host_type}`;
	const ws = new WebSocket(url);

	ws.onopen = () => ws.send(JSON.stringify({ type: 'subscribe', interval }));
	ws.onmessage = (e) => {
		try {
			const msg = JSON.parse(e.data);

			if (msg.type === 'alarm-monitor') onData && onData(msg, msg.ts);
			else if (msg.type === 'error') onError && onError(new Error(msg.message));
		} catch (err) { onError && onError(err); }
	};
	ws.onerror = (e) => onError && onError(e);

	return ws;
}
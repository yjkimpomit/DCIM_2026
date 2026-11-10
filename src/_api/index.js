import axios from 'axios';
export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND
});


export async function loadServerInfo() {

	const { data } = await api.get('/api/server');
	return data.data;
}

export async function loadImmersionInfo() {

	const { data } = await api.get('/api/immersion');
	return data.data;
}

export async function loadAlarmList(type) {

	const { data } = await api.get(`/api/alarm?hostids=${type}`);
	return data.events;
}
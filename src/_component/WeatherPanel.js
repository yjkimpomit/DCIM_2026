const defaultDetails = [
	["icon-rain", "강수확률", "20%"],
	["icon-rainfall", "강수량", "0.0mm"],
	["icon-humid", "습도", "55%"],
	["icon-speed", "풍속", "2.0m/s"],
	["icon-windy", "풍향", "남동"],
];

export default function WeatherPanel({ temperature = 20, icon = "weather-cloudy-rain", dateTime = "2026-06-11T14:29:27", dateText = "2026.06.11 (목) 14:29:27", details = defaultDetails }) {
	return (
		<section className="weather-panel" aria-label="현재 날씨">
			<div className="weather-summary">
				{/* weather-symbol-icon: icon 속성에 아래 파일명을 확장자 없이 전달합니다.
            weather-sunny: 맑음
            weather-partly-cloudy: 구름 조금
            weather-cloudy: 흐림
            weather-rain: 비
            weather-cloudy-rain: 구름과 비 (기본값)
            파일 경로: /images/icons/{icon}.svg */}
				<div className="weather-symbol"><img className="weather-symbol-icon" src={`/images/icons/${icon}.svg`} alt="" width={48} height={48} /></div>
				<div>
					<p className="weather-temperature"><strong className="weather-temperature-value">{temperature}</strong><span className="weather-temperature-unit">°C</span></p>
					<time className="weather-date" dateTime={dateTime}>{dateText}</time>
				</div>
			</div>
			<dl className="weather-details">
				{details.map(([detailIcon, label, value]) => (
					<div className="weather-detail" key={label}>
						<dt><img className="weather-detail-icon" src={`/images/icons/${detailIcon}.svg`} alt="" width={24} height={24} /><span className="visually-hidden">{label}</span></dt>
						<dd>{value}</dd>
					</div>
				))}
			</dl>
		</section>
	);
}

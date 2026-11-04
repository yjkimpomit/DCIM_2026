"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { initFullScreenBtn } from '@/_lib/common';
export default function PageFrame(props){
    const pathname = usePathname();
    const [p_name,setPname] = useState("");
    const {recent,setOpen} = props;

    useEffect(() => {
        if(pathname === "/server-monitoring") setPname("Server Monitoring")
        else setPname("Immersion Cooling Monitoring")
    }, [pathname]);

    useEffect(() => {
        initFullScreenBtn();
    },[]);


    const type = p_name == "Server Monitoring" ? 'server' : 'immersion'
    return(
      <>
        <div id="header" className="header">		
		<h1 id="logo" className="logo">
			<img src="/images/twinplant_silver_h.svg" width={100} height={50} alt="POMIT"/> <span>DCIM</span>
		</h1>
		<ul  className="breadcrumb">
			<li><span>디지털 트윈 통합관제 모니터링 시스템</span></li>
			<li><span>{p_name}</span></li>
		</ul>
		<div className="extra-info">
			<span className="today">{}</span>
		</div>
	</div>
	
	<div id="leftNav" className="left-nav">
		<ul>
			<li>
				<Link href="/server-monitoring" className="icon icon-menu01"><span>HOME</span></Link>
			</li>
			<li>
				<a href="/login" className="icon icon-menu02"><span>Logout</span></a>
			</li>
			<li>
				{/* <!-- alert 클래스는 새로운 알림메세지가 있는 경우에만 넣어줍니다. 모달로 띄우는 경우 함수명만 변경(openPopup -> openModal)하여 사용가능합니다. --> */}
			  <button href="#" className={`icon icon-menu03 ${recent > 0 ? 'alert' : ''}`} onClick={() => {setOpen(true)}}><span>최근 알림 {recent}건</span></button>
			</li>
			<li className="spacer"></li>
			<li>
				{/* <!-- 현재 페이지 표시되는 클래스는 active 입니다. --> */}
				<Link href="/server-monitoring" className={`icon icon-menu04 ${type == "server" ? 'active' : ''}`}><span>Server Monitoring</span></Link>
			</li>
			<li>
				<Link href="/immersion-monitoring" className={`icon icon-menu05 ${type == "immersion" ? 'active' : ''}`}><span>Immersion Cooling Monitoring</span></Link>
			</li>
			<li className="spacer"></li>
			<li>
				<button id="toggleFullscreenBtn" className="icon fullscreen fs-on"><span>전체화면 모드</span></button>
			</li>
		</ul>
	</div>
      </>
    )
}
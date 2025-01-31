import React, { useRef, useEffect } from "react";

const { kakao } = window;

const KakaoMapRead = ({geoLat, geoLng}) => {
    const mapContentRef = useRef();
    useEffect(()=>{

        const mapOption = {
            center: new kakao.maps.LatLng(geoLat, geoLng), // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        }
        console.log("받아온 지도의 위도:", geoLat);
        console.log("받아온 지도의 경도:", geoLng);
        // 지도를 생성합니다    
        const map = new kakao.maps.Map(mapContentRef.current, mapOption); // argu1 : 지도를 넣을 html element, argu2 : map option
        const coords = new kakao.maps.LatLng(geoLat, geoLng);

        // 결과값으로 받은 위치를 마커로 표시합니다
        new kakao.maps.Marker({
            map: map,
            position: coords
        });
    });  
    return(
        <div ref={mapContentRef} style={{width: "300px", height: "300px"}}>

        </div>
    );
}

export default React.memo(KakaoMapRead);
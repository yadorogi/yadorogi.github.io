// マップの初期化
function initMap() {
    // 新しい地図のインスタンスを作成する
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 35.638591, lng: 139.746087 }, // 地図の中央に表示する地点を設定する
        zoom: 12, // 地図の初期ズームレベルを設定
    });

    // マーカーを格納する配列
    const markers = [];

    // 地図にクリック・イベント・リスナーを追加する
    map.addListener("click", (event) => {
        // クリックした位置に新しいマーカーを作成
        const marker = new google.maps.Marker({
            position: event.latLng,
            map: map,
        });

        // マーカーを配列に追加する
        markers.push(marker);
    });

    // マーカーを巡回する機能
    function cycleMarkers() {
        let currentIndex = 0;

        setInterval(() => {
            // 地図から前のマーカーを取り除く
            if (currentIndex > 0) {
                markers[currentIndex - 1].setMap(null);
            }

            // 現在のマーカーを地図に追加する
            markers[currentIndex].setMap(map);

            // 巡回ルートの追加に合わせてインデックスを増やす
            currentIndex = (currentIndex + 1) % markers.length;

            // 最適化されたルートを計算し表示する
            if (currentIndex === 0) {
                const directionsService = new google.maps.DirectionsService();
                const directionsRenderer = new google.maps.DirectionsRenderer({
                    map: map,
                });

                const waypoints = markers.map((marker) => ({
                    location: marker.getPosition(),
                    stopover: true,
                }));

                directionsService.route(
                    {
                        origin: waypoints[0].location, // 出発地
                        destination: waypoints[0].location, // 目的地
                        waypoints: waypoints.slice(1), // 経由地
                        optimizeWaypoints: true, // 最適化を有効にする
                        travelMode: google.maps.TravelMode.DRIVING, // 交通手段を自動車に設定する
                    },
                    (response, status) => {
                        if (status === "OK") {
                            directionsRenderer.setDirections(response);
                            displayRouteAddresses(response.routes[0]);
                        } else {
                            console.log("次の理由でルートを計算に失敗しました：【" + status + "】" );
                        }
                    }
                );
            }
        }, 2000); // マーカーを立ててから画面の表示位置と、ズームを変更するまでの時間を2秒に設定する

    // cycleMarkers関数を呼び出して、マーカーのサイクルを開始する
    cycleMarkers();

    // ルートを表示する
    function displayRouteAddresses(route) {
        const addresses = route.legs.map((leg) => leg.end_address);
        console.log(addresses);
        // 本番想定では、以下でアドレスを表示する（例：DOM操作など）
    }
}

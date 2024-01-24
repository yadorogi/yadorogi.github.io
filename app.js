let map;
let markers = [];
let tourIndex = 0;
let directionsService;
let tourInterval;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 35.689, lng: 139.691 }, // 東京の座標
        zoom: 12
    });

    directionsService = new google.maps.DirectionsService();

    // マップ上でクリックしたときのイベントリスナーを追加
    map.addListener('click', function(event) {
        addMarker(event.latLng);
    });

    // マーカーが3つ以上あれば経路を計算して巡回を開始
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('calculateRouteBtn').addEventListener('click', function() {
            if (markers.length >= 2) {
                calculateAndDisplayRoute();
            } else {
                alert('最低2つのマーカーが必要です。');
            }
        });
    });

    // マーカーの巡回ボタン
    document.getElementById('startTourBtn').addEventListener('click', function() {
        if (markers.length >= 2) {
            startTour();
        } else {
            alert('最低2つのマーカーが必要です。');
        }
    });
}

function addMarker(location) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        label: String(markers.length + 1)
    });

    markers.push(marker);
}

function calculateAndDisplayRoute() {
    const waypoints = markers.slice(1, -1).map(marker => ({ location: marker.getPosition(), stopover: true }));

    const request = {
        origin: markers[0].getPosition(),
        destination: markers[markers.length - 1].getPosition(),
        waypoints: waypoints,
        optimizeWaypoints: true,  // 経由地点のルートで、より効率的な順序に地点を求める（巡回セールスマン問題の応用）
        travelMode: 'DRIVING',    // 車でのルート検索（道路網を利用した標準の運転ルート）
    };

    directionsService.route(request, function(result, status) {
        if (status === 'OK') {
            map.setDirections(result);
        } else {
            console.error('Directions request failed due to ' + status);
        }
    });
}

function startTour() {
    tourIndex = 0;
    tourInterval = setInterval(function() {
        if (tourIndex < markers.length) {
            const marker = markers[tourIndex];
            map.panTo(marker.getPosition());
            tourIndex++;
        } else {
            clearInterval(tourInterval);
        }
    }, 2000); // マーカー間の移動時間（2秒）
}

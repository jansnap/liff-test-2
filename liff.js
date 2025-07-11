$(document).ready(function () {
    // liffId: LIFF URL "https://liff.line.me/xxx"のxxxに該当する箇所
    // LINE DevelopersのLIFF画面より確認可能
    var liffId = "2007732537-K8gaZLDe";
    initializeLiff(liffId);
    window.liffData = {
        imageDataUrl: null,
        location: null
    };
    // カメラボタン
    $('#camera-btn').on('click', function() {
        openCamera();
    });
    // 位置情報ボタン
    $('#location-btn').on('click', function() {
        getLocation();
    });
});
// カメラ撮影
function openCamera() {
    var available = liff.isApiAvailable('camera');
    document.getElementById('photo-preview').innerHTML = 'isApiAvailable(camera): ' + available;
    if (!available) {
        alert('カメラAPIが利用できません');
        return;
    }
    liff.camera.openCamera({mode: 'picture'}).then(result => {
        alert('カメラを起動しました！');
        if (result && result.dataUrl) {
            window.liffData.imageDataUrl = result.dataUrl;
            const preview = document.getElementById('photo-preview');
            preview.innerHTML = `<img src="${result.dataUrl}" class="img-fluid" style="max-width:300px;" />`;
            alert('写真を撮影してプレビューを表示しました！');
        }
    }).catch(err => {
        alert('カメラ起動失敗: ' + err);
    });
}

// 位置情報取得
function getLocation() {
    if (!navigator.geolocation) {
        alert('位置情報APIが利用できません');
        return;
    }
    navigator.geolocation.getCurrentPosition(function(pos) {
        window.liffData.location = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
        };
        const preview = document.getElementById('location-preview');
        preview.innerHTML = `緯度: ${pos.coords.latitude}<br>経度: ${pos.coords.longitude}`;
    }, function(err) {
        alert('位置情報取得失敗: ' + err.message);
    });
}

function initializeLiff(liffId) {
    liff
        .init({
            liffId: liffId
        })
        .then(() => {
            // Webブラウザからアクセスされた場合は、LINEにログインする
            if (!liff.isInClient() && !liff.isLoggedIn()) {
                window.alert("LINEアカウントにログインしてください。");
                liff.login({redirectUri: location.href});
            }
        })
        .catch((err) => {
            console.log('LIFF Initialization failed ', err);
        });
}


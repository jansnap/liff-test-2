$(document).ready(function () {
    // liffId: LIFF URL "https://liff.line.me/xxx"のxxxに該当する箇所
    // LINE DevelopersのLIFF画面より確認可能
    var liffId = "2007732537-K8gaZLDe";
    initializeLiff(liffId);
});

// カメラ撮影
function openCamera() {
    console.log('openCamera called');

    // LIFFが初期化されているか確認
    if (typeof liff === 'undefined') {
        alert('LIFF SDKが読み込まれていません');
        return;
    }

    // LIFFが初期化されているか確認
    if (!liff.isInitialized()) {
        alert('LIFFが初期化されていません。しばらく待ってから再試行してください。');
        return;
    }

    console.log('liff.isInitialized(): ' + liff.isInitialized());

    // カメラAPIが利用可能か確認
    var available = liff.isApiAvailable('camera');
    console.log('isApiAvailable(camera): ' + available);

    var preview = document.getElementById('photo-preview');
    preview.style.background = 'yellow';
    preview.innerHTML = 'isApiAvailable(camera): ' + available;

    if (!available) {
        alert('カメラAPIが利用できません。LINEアプリ内でアクセスしてください。');
        return;
    }

    // カメラを開く
    liff.camera.openCamera({mode: 'picture'})
        .then(result => {
            console.log('カメラを起動しました！');
            if (result && result.dataUrl) {
                window.liffData.imageDataUrl = result.dataUrl;
                const preview = document.getElementById('photo-preview');
                preview.innerHTML = `<img src="${result.dataUrl}" class="img-fluid" style="max-width:300px;" />`;
                alert('写真を撮影してプレビューを表示しました！');
            }
        })
        .catch(err => {
            console.error('カメラ起動失敗:', err);
            alert('カメラ起動失敗: ' + err.message || err);
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
    console.log('LIFF初期化開始');

    liff
        .init({
            liffId: liffId
        })
        .then(() => {
            console.log('LIFF初期化成功');

            // LIFF初期化後にボタンイベントを登録
            window.liffData = {
                imageDataUrl: null,
                location: null
            };

            $('#camera-btn').on('click', function() {
                openCamera();
            });

            $('#location-btn').on('click', function() {
                getLocation();
            });

            // LINEアプリ内でない場合の処理
            if (!liff.isInClient()) {
                console.log('LINEアプリ外でアクセス');
                if (!liff.isLoggedIn()) {
                    console.log('LINEにログインしていません');
                    window.alert("LINEアカウントにログインしてください。");
                    liff.login({redirectUri: location.href});
                }
            } else {
                console.log('LINEアプリ内でアクセス');
            }
        })
        .catch((err) => {
            console.error('LIFF Initialization failed ', err);
            alert('LIFF初期化に失敗しました: ' + err.message);
        });
}


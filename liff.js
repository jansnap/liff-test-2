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

    // LIFF SDKの情報を出力
    console.log('LIFF SDK Version:', liff.version);
    console.log('LIFF SDK Build:', liff.build);
    console.log('LIFF isInClient:', liff.isInClient());
    console.log('LIFF isLoggedIn:', liff.isLoggedIn());

    // 利用可能なAPIを確認
    console.log('Available APIs:');
    const apis = ['camera', 'profile', 'friendship', 'shareTargetPicker', 'scanCode', 'openWindow'];
    apis.forEach(api => {
        try {
            const available = liff.isApiAvailable(api);
            console.log(`  ${api}: ${available}`);
        } catch (e) {
            console.log(`  ${api}: Error - ${e.message}`);
        }
    });

    // カメラAPIが利用可能か確認
    var available = false;
    try {
        available = liff.isApiAvailable('camera');
        console.log('isApiAvailable(camera): ' + available);
    } catch (e) {
        console.error('カメラAPI確認エラー:', e);
        alert('カメラAPIが利用できません: ' + e.message);
        return;
    }

    var preview = document.getElementById('photo-preview');
    preview.style.background = 'yellow';
    preview.innerHTML = 'isApiAvailable(camera): ' + available;

    if (!available) {
        alert('カメラAPIが利用できません。LINEアプリ内でアクセスしてください。');
        return;
    }

    // カメラを開く
    try {
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
    } catch (e) {
        console.error('カメラAPI呼び出しエラー:', e);
        alert('カメラAPI呼び出しエラー: ' + e.message);
    }
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

    // LIFF SDKのバージョンを確認
    if (typeof liff !== 'undefined') {
        console.log('LIFF SDK Version:', liff.version);
        console.log('LIFF SDK Build:', liff.build);

        // 利用可能なプロパティを確認
        console.log('LIFF SDK Properties:');
        for (let prop in liff) {
            if (liff.hasOwnProperty(prop)) {
                console.log(`  ${prop}: ${typeof liff[prop]} - ${liff[prop]}`);
            }
        }
    }

    liff
        .init({
            liffId: liffId
        })
        .then(() => {
            console.log('LIFF初期化成功');

            // LIFFの準備が完了するまで待つ
            return liff.ready;
        })
        .then(() => {
            console.log('LIFF準備完了');

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


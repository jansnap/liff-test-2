$(function () {
    // 新フォーム送信
    $('#photo-form').submit(function (e) {
        e.preventDefault();

        // データの確認（複数のソースから）
        let imageDataUrl = window.liffData ? window.liffData.imageDataUrl : null;
        let location = window.liffData ? window.liffData.location : null;

        // localStorageからも確認
        if (!imageDataUrl || !location) {
            try {
                const savedData = localStorage.getItem('liffData');
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    if (!imageDataUrl && parsedData.imageDataUrl) {
                        imageDataUrl = parsedData.imageDataUrl;
                        console.log('localStorageから画像データを復元');
                    }
                    if (!location && parsedData.location) {
                        location = parsedData.location;
                        console.log('localStorageから位置情報を復元');
                    }
                }
            } catch (e) {
                console.error('localStorage復元エラー:', e);
            }
        }

        // sessionStorageからも確認
        if (!imageDataUrl || !location) {
            try {
                const savedData = sessionStorage.getItem('liffData');
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    if (!imageDataUrl && parsedData.imageDataUrl) {
                        imageDataUrl = parsedData.imageDataUrl;
                        console.log('sessionStorageから画像データを復元');
                    }
                    if (!location && parsedData.location) {
                        location = parsedData.location;
                        console.log('sessionStorageから位置情報を復元');
                    }
                }
            } catch (e) {
                console.error('sessionStorage復元エラー:', e);
            }
        }

        var comment = $('#comment').val();

        console.log('送信前データ確認:');
        console.log('  imageDataUrl:', imageDataUrl ? 'あり' : 'なし');
        console.log('  location:', location ? 'あり' : 'なし');
        console.log('  comment:', comment);

        if (!imageDataUrl) {
            alert('写真を撮影してください');
            return false;
        }
        if (!location) {
            alert('位置情報を取得してください');
            return false;
        }

        // サーバ送信
        $.ajax({
            url: 'https://enabling-manager-273478588192.asia-northeast1.run.app/api/upload',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                image: imageDataUrl,
                latitude: location.latitude,
                longitude: location.longitude,
                comment: comment
            }),
            success: function (res) {
                alert('送信しました！');
                // 送信成功後にデータをクリア
                try {
                    localStorage.removeItem('liffData');
                    sessionStorage.removeItem('liffData');
                    window.liffData = { imageDataUrl: null, location: null };
                    console.log('送信成功後、データをクリアしました');
                } catch (e) {
                    console.error('データクリアエラー:', e);
                }
            },
            error: function (err) {
                alert('送信に失敗しました: ' + err.statusText);
            }
        });
        return false;
    });
});

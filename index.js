$(function () {
    // 新フォーム送信
    $('#photo-form').submit(function (e) {
        e.preventDefault();
        var imageDataUrl = window.liffData.imageDataUrl;
        var location = window.liffData.location;
        var comment = $('#comment').val();

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
            },
            error: function (err) {
                alert('送信に失敗しました: ' + err.statusText);
            }
        });
        return false;
    });
});
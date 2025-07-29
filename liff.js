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
    console.log('LIFF SDK Version:', liff.getVersion());
    if (liff.build !== undefined) {
        console.log('LIFF SDK Build:', liff.build);
    }
    console.log('LIFF isInClient:', liff.isInClient());
    console.log('LIFF isLoggedIn:', liff.isLoggedIn());

    // 利用可能なAPIを確認（LIFF SDK 2.27.1で利用可能なもののみ）
    console.log('Available APIs:');
    const apis = ['shareTargetPicker', 'scanCodeV2', 'permanentLink', 'i18n', 'iap'];
    apis.forEach(api => {
        try {
            const available = liff.isApiAvailable(api);
            console.log(`  ${api}: ${available}`);
        } catch (e) {
            console.log(`  ${api}: Error - ${e.message}`);
        }
    });

    // LINEアプリ内でない場合はカメラAPIが利用できない
    if (!liff.isInClient()) {
        alert('カメラAPIはLINEアプリ内でのみ利用可能です。LINEアプリ内でアクセスしてください。');
        return;
    }

    console.log('LINEアプリ内でカメラ撮影を開始します');

    // カメラAPIが利用可能か確認
    var available = false;
    try {
        // LIFF SDK 2.27.1ではカメラAPIが利用できない可能性があるため、
        // 代替手段としてファイル選択を使用
        available = true; // 一旦trueに設定
        console.log('カメラAPIの代替手段を使用します');

        // 実際にLIFFカメラAPIを試す（利用可能な場合）
        if (typeof liff.scanCodeV2 === 'function') {
            console.log('LIFF scanCodeV2 APIが利用可能です');
        }

        // カメラAPIの利用可能性を確認
        const cameraAvailable = liff.isApiAvailable && liff.isApiAvailable('scanCodeV2');
        console.log('カメラAPI利用可能性:', cameraAvailable);

    } catch (e) {
        console.error('カメラAPI確認エラー:', e);
        alert('カメラAPIが利用できません: ' + e.message);
        return;
    }

    var preview = document.getElementById('photo-preview');
    preview.style.background = 'yellow';
    preview.innerHTML = `
        <div style="margin: 10px 0; text-align: center;">
            <div style="color: #007bff; font-weight: bold; margin-bottom: 10px;">
                📷 カメラ撮影を開始します
            </div>
            <div style="color: #6c757d; font-size: 14px;">
                下部に表示される選択肢から「カメラ」を選択してください
            </div>
        </div>
    `;

    if (!available) {
        alert('カメラAPIが利用できません。LINEアプリ内でアクセスしてください。');
        return;
    }

    // LINEアプリ内でのカメラ撮影処理
    try {
        console.log('ファイル選択ダイアログを開きます');

        // ファイル選択による代替手段
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.capture = 'camera'; // カメラを優先

        // ファイル選択ダイアログを即座に開く
        try {
            fileInput.click();
            console.log('ファイル選択ダイアログを開きました');
        } catch (e) {
            console.error('ファイル選択ダイアログを開けませんでした:', e);
            alert('ファイル選択ダイアログを開けませんでした: ' + e.message);
            return;
        }

        // タイムアウト処理を追加
        const timeoutId = setTimeout(() => {
            console.log('ファイル選択タイムアウト');
            alert('ファイル選択がタイムアウトしました。再度お試しください。');
        }, 10000); // 10秒タイムアウト（デバッグ用）

        fileInput.onchange = function(e) {
            clearTimeout(timeoutId); // タイムアウトをクリア
            console.log('ファイル選択イベント発生');
            const file = e.target.files[0];
            console.log('選択されたファイル:', file);

            // プレビューを更新して処理開始を表示
            const preview = document.getElementById('photo-preview');
            preview.style.background = 'lightblue';
            preview.innerHTML = `
                <div style="margin: 10px 0; text-align: center;">
                    <div style="color: #007bff; font-weight: bold; margin-bottom: 10px;">
                        🔄 画像を処理中...
                    </div>
                    <div style="color: #6c757d; font-size: 14px;">
                        ファイルサイズ: ${file ? file.size : 0} バイト
                    </div>
                </div>
            `;

            if (file) {
                console.log('ファイルサイズ:', file.size);
                console.log('ファイルタイプ:', file.type);

                // 即座にデータを保存（FileReader完了前）
                const tempDataUrl = URL.createObjectURL(file);
                console.log('一時的なdataUrl作成:', tempDataUrl);

                // 即座にプレビューを表示
                const preview = document.getElementById('photo-preview');
                preview.style.background = 'white';
                preview.innerHTML = `
                    <div style="margin: 10px 0;">
                        <img src="${tempDataUrl}" class="img-fluid" style="max-width:300px; border: 2px solid #007bff;" />
                        <div style="margin-top: 10px; color: green; font-weight: bold;">
                            ✓ 写真が撮影されました（処理中...）
                        </div>
                    </div>
                `;
                console.log('即座にプレビュー表示完了');
            } else {
                console.log('ファイルが選択されませんでした');
                const preview = document.getElementById('photo-preview');
                preview.style.background = 'lightcoral';
                preview.innerHTML = `
                    <div style="margin: 10px 0; text-align: center;">
                        <div style="color: #dc3545; font-weight: bold; margin-bottom: 10px;">
                            ❌ ファイルが選択されませんでした
                        </div>
                        <div style="color: #6c757d; font-size: 14px;">
                            再度カメラボタンを押して撮影してください
                        </div>
                    </div>
                `;
                return;
            }

                const reader = new FileReader();
                reader.onload = function(e) {
                    console.log('FileReader onload 実行');
                    const dataUrl = e.target.result;
                    console.log('dataUrl 生成完了, 長さ:', dataUrl.length);

                    // window.liffDataが存在しない場合は初期化
                    if (!window.liffData) {
                        window.liffData = {
                            imageDataUrl: null,
                            location: null
                        };
                        console.log('window.liffDataを初期化しました');
                    }

                    // データを保存
                    window.liffData.imageDataUrl = dataUrl;
                    console.log('window.liffDataに画像データを設定:', window.liffData);

                    // カメラ撮影時の詳細ログ
                    console.log('=== カメラ撮影データ詳細 ===');
                    console.log('画像データサイズ:', dataUrl.length, '文字');
                    console.log('画像データの先頭100文字:', dataUrl.substring(0, 100));
                    console.log('画像データの末尾100文字:', dataUrl.substring(dataUrl.length - 100));
                    console.log('window.liffDataの構造:', {
                        hasImageData: !!window.liffData.imageDataUrl,
                        imageDataLength: window.liffData.imageDataUrl ? window.liffData.imageDataUrl.length : 0,
                        hasLocation: !!window.liffData.location
                    });

                    // syslogに出力
                    logToSyslog(`カメラ撮影完了 - 画像サイズ: ${dataUrl.length}文字`, 'INFO');
                    debugToSyslog({
                        imageSize: dataUrl.length,
                        imageDataStart: dataUrl.substring(0, 100),
                        imageDataEnd: dataUrl.substring(dataUrl.length - 100),
                        liffData: {
                            hasImageData: !!window.liffData.imageDataUrl,
                            imageDataLength: window.liffData.imageDataUrl ? window.liffData.imageDataUrl.length : 0,
                            hasLocation: !!window.liffData.location
                        }
                    }, 'カメラ撮影データ詳細');

                    // 保存処理をPromiseでラップして確実に完了を待つ
                    const saveDataPromise = new Promise((resolve, reject) => {
                        try {
                            console.log('保存開始 - window.liffData:', window.liffData);

                            // データのJSON文字列化を確認
                            const dataToSave = JSON.stringify(window.liffData);
                            console.log('保存するデータ（JSON）:', dataToSave.substring(0, 100) + '...');

                            // localStorageの容量制限を事前チェック
                            const dataSize = dataToSave.length;
                            console.log('保存しようとしているデータサイズ:', dataSize, '文字');

                            // localStorageの現在の使用量をチェック
                            let currentUsage = 0;
                            for (let key in localStorage) {
                                if (localStorage.hasOwnProperty(key)) {
                                    currentUsage += localStorage[key].length;
                                }
                            }
                            console.log('localStorage現在使用量:', currentUsage, '文字');
                            console.log('localStorage残り容量推定:', (5 * 1024 * 1024) - currentUsage, '文字'); // 5MB制限を想定

                            if (dataSize > (5 * 1024 * 1024)) {
                                console.warn('データサイズが5MBを超えています。保存に失敗する可能性があります。');
                                logToSyslog(`警告: データサイズが5MBを超えています (${dataSize}文字)`, 'WARN');
                            }

                            // sessionStorageとlocalStorageの両方に保存
                            sessionStorage.setItem('liffData', dataToSave);
                            localStorage.setItem('liffData', dataToSave);
                            console.log('データをsessionStorageとlocalStorageに保存しました');

                            // 即座に保存確認
                            const savedData = localStorage.getItem('liffData');
                            const sessionData = sessionStorage.getItem('liffData');
                            console.log('即座の保存確認 - localStorage:', savedData ? '保存済み' : '未保存');
                            console.log('即座の保存確認 - sessionStorage:', sessionData ? '保存済み' : '未保存');

                            // 保存完了を確認
                            setTimeout(() => {
                                const finalSavedData = localStorage.getItem('liffData');
                                const finalSessionData = sessionStorage.getItem('liffData');
                                if (finalSavedData && finalSessionData) {
                                    console.log('最終保存確認 - localStorage:', '保存済み');
                                    console.log('最終保存確認 - sessionStorage:', '保存済み');
                                    console.log('保存されたデータサイズ:', finalSavedData.length);
                                    resolve();
                                } else {
                                    console.error('保存確認失敗 - localStorage:', finalSavedData ? 'あり' : 'なし');
                                    console.error('保存確認失敗 - sessionStorage:', finalSessionData ? 'あり' : 'なし');
                                    logToSyslog('エラー: データ保存の確認に失敗しました', 'ERROR');
                                    reject(new Error('データ保存の確認に失敗しました'));
                                }
                            }, 500); // 500ms待機して保存完了を確認
                        } catch (e) {
                            console.error('ストレージ保存エラー:', e);

                            // localStorageの容量制限をチェック
                            if (e.name === 'QuotaExceededError') {
                                console.error('localStorageの容量制限に達しました');
                                reject(new Error('localStorageの容量制限に達しました。画像サイズを小さくしてください。'));
                            } else {
                                reject(e);
                            }
                        }
                    });

                    // 保存完了後にプレビュー表示とメッセージ表示
                    saveDataPromise.then(() => {
                        console.log('データ保存完了 - プレビュー表示開始');

                        // 最終的なプレビューを表示
                        const preview = document.getElementById('photo-preview');
                        preview.style.background = 'white';
                        preview.innerHTML = `
                            <div style="margin: 10px 0;">
                                <img src="${dataUrl}" class="img-fluid" style="max-width:300px; border: 2px solid #007bff;" />
                                <div style="margin-top: 10px; color: green; font-weight: bold;">
                                    ✓ 写真が撮影されました
                                </div>
                            </div>
                        `;
                        console.log('最終プレビュー表示完了');

                        // 成功メッセージを表示
                        logToSyslog('カメラ撮影とlocalStorage保存が完了しました', 'INFO');
                        const successMsg = document.createElement('div');
                        successMsg.style.cssText = `
                            position: fixed;
                            top: 20px;
                            left: 50%;
                            transform: translateX(-50%);
                            background: #28a745;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 5px;
                            z-index: 1000;
                            font-weight: bold;
                        `;
                        successMsg.textContent = '写真を撮影しました！';
                        document.body.appendChild(successMsg);

                        // 3秒後にメッセージを削除
                        setTimeout(() => {
                            if (successMsg.parentNode) {
                                successMsg.parentNode.removeChild(successMsg);
                            }
                        }, 3000);

                        // フォームの状態を確認
                        console.log('現在のliffData:', window.liffData);

                        // 保存完了の最終確認
                        setTimeout(() => {
                            const finalSavedData = localStorage.getItem('liffData');
                            console.log('最終保存確認 - localStorage:', finalSavedData ? '保存済み' : '未保存');

                            // デバッグ用：localStorageの内容を確認
                            if (finalSavedData) {
                                try {
                                    const parsedData = JSON.parse(finalSavedData);
                                    console.log('localStorageに保存されたデータ:', {
                                        hasImageData: !!parsedData.imageDataUrl,
                                        imageDataLength: parsedData.imageDataUrl ? parsedData.imageDataUrl.length : 0,
                                        hasLocation: !!parsedData.location
                                    });
                                } catch (e) {
                                    console.error('localStorageデータの解析エラー:', e);
                                }
                            }
                        }, 1000);

                    }).catch((error) => {
                        console.error('データ保存エラー:', error);

                        // エラーメッセージを表示
                        const errorMsg = document.createElement('div');
                        errorMsg.style.cssText = `
                            position: fixed;
                            top: 20px;
                            left: 50%;
                            transform: translateX(-50%);
                            background: #dc3545;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 5px;
                            z-index: 1000;
                            font-weight: bold;
                        `;
                        errorMsg.textContent = 'データ保存エラー: ' + error.message;
                        document.body.appendChild(errorMsg);

                        setTimeout(() => {
                            if (errorMsg.parentNode) {
                                errorMsg.parentNode.removeChild(errorMsg);
                            }
                        }, 3000);
                    });
                };

                reader.onerror = function(e) {
                    console.error('FileReader エラー:', e);
                    const errorMsg = document.createElement('div');
                    errorMsg.style.cssText = `
                        position: fixed;
                        top: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: #dc3545;
                        color: white;
                        padding: 10px 20px;
                        border-radius: 5px;
                        z-index: 1000;
                        font-weight: bold;
                    `;
                    errorMsg.textContent = 'ファイル読み込みエラー';
                    document.body.appendChild(errorMsg);

                    setTimeout(() => {
                        if (errorMsg.parentNode) {
                            errorMsg.parentNode.removeChild(errorMsg);
                        }
                    }, 3000);
                };

                reader.onabort = function(e) {
                    console.error('FileReader 中断:', e);
                    const abortMsg = document.createElement('div');
                    abortMsg.style.cssText = `
                        position: fixed;
                        top: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: #ffc107;
                        color: black;
                        padding: 10px 20px;
                        border-radius: 5px;
                        z-index: 1000;
                        font-weight: bold;
                    `;
                    abortMsg.textContent = 'ファイル読み込みが中断されました';
                    document.body.appendChild(abortMsg);

                    setTimeout(() => {
                        if (abortMsg.parentNode) {
                            abortMsg.parentNode.removeChild(abortMsg);
                        }
                    }, 3000);
                };

                console.log('FileReader readAsDataURL 開始');
                reader.readAsDataURL(file);

        };

        fileInput.onerror = function(e) {
            clearTimeout(timeoutId); // タイムアウトをクリア
            console.error('ファイル選択エラー:', e);
            alert('ファイル選択エラーが発生しました');
        };

        console.log('ファイル選択ダイアログを開きます');
        fileInput.click();

    } catch (e) {
        console.error('カメラ撮影処理エラー:', e);
        alert('カメラ撮影処理でエラーが発生しました: ' + e.message);
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

        // sessionStorageとlocalStorageの両方に保存
        try {
            sessionStorage.setItem('liffData', JSON.stringify(window.liffData));
            localStorage.setItem('liffData', JSON.stringify(window.liffData));
            console.log('位置情報をsessionStorageとlocalStorageに保存しました');
        } catch (e) {
            console.error('ストレージ保存エラー:', e);
        }

        const preview = document.getElementById('location-preview');
        preview.innerHTML = `緯度: ${pos.coords.latitude}<br>経度: ${pos.coords.longitude}`;
    }, function(err) {
        alert('位置情報取得失敗: ' + err.message);
    });
}

function initializeLiff(liffId) {
    console.log('LIFF初期化開始');

    // ページリロード検知
    window.addEventListener('beforeunload', function(e) {
        console.log('ページリロード検知 - データを保存');

        // データ保存中の場合、遷移を防ぐ
        if (window.liffData && window.liffData.imageDataUrl) {
            const savedData = localStorage.getItem('liffData');
            if (!savedData) {
                e.preventDefault();
                e.returnValue = 'データ保存中です。ページを離れますか？';
                console.log('データ保存中 - ページ遷移を防止');
            }
        }

        // 常にデータを保存
        if (window.liffData) {
            try {
                localStorage.setItem('liffData', JSON.stringify(window.liffData));
                console.log('localStorageにデータを保存しました');
            } catch (e) {
                console.error('localStorage保存エラー:', e);
            }
        }
    });

    // ページ離脱検知（より確実）
    window.addEventListener('pagehide', function(e) {
        console.log('ページ離脱検知 - データを保存');

        // データ保存中の場合、遷移を防ぐ
        if (window.liffData && window.liffData.imageDataUrl) {
            const savedData = localStorage.getItem('liffData');
            if (!savedData) {
                e.preventDefault();
                console.log('データ保存中 - ページ離脱を防止');
            }
        }

        // 常にデータを保存
        if (window.liffData) {
            try {
                localStorage.setItem('liffData', JSON.stringify(window.liffData));
                console.log('localStorageにデータを保存しました（pagehide）');
            } catch (e) {
                console.error('localStorage保存エラー（pagehide）:', e);
            }
        }
    });

    // ページの状態を復元（sessionStorageとlocalStorageの両方から）
    let savedData = null;

    // まずsessionStorageから復元を試行
    if (sessionStorage.getItem('liffData')) {
        try {
            savedData = JSON.parse(sessionStorage.getItem('liffData'));
            console.log('sessionStorageからデータを復元:', savedData);
        } catch (e) {
            console.error('sessionStorage復元エラー:', e);
        }
    }

    // sessionStorageにない場合はlocalStorageから復元
    if (!savedData && localStorage.getItem('liffData')) {
        try {
            savedData = JSON.parse(localStorage.getItem('liffData'));
            console.log('localStorageからデータを復元:', savedData);
        } catch (e) {
            console.error('localStorage復元エラー:', e);
        }
    }

    if (savedData) {
        window.liffData = savedData;

        // プレビューを復元
        if (window.liffData.imageDataUrl) {
            const preview = document.getElementById('photo-preview');
            preview.style.background = 'white';
            preview.innerHTML = `
                <div style="margin: 10px 0;">
                    <img src="${window.liffData.imageDataUrl}" class="img-fluid" style="max-width:300px; border: 2px solid #007bff;" />
                    <div style="margin-top: 10px; color: green; font-weight: bold;">
                        ✓ 写真が撮影されました
                    </div>
                </div>
            `;
            console.log('写真プレビューを復元しました');

            // 復元成功メッセージを表示
            const restoreMsg = document.createElement('div');
            restoreMsg.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #17a2b8;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 1000;
                font-weight: bold;
            `;
            restoreMsg.textContent = '撮影データを復元しました';
            document.body.appendChild(restoreMsg);

            setTimeout(() => {
                if (restoreMsg.parentNode) {
                    restoreMsg.parentNode.removeChild(restoreMsg);
                }
            }, 3000);
        }

        if (window.liffData.location) {
            const locationPreview = document.getElementById('location-preview');
            locationPreview.innerHTML = `緯度: ${window.liffData.location.latitude}<br>経度: ${window.liffData.location.longitude}`;
            console.log('位置情報プレビューを復元しました');
        }
    } else {
        console.log('保存されたデータが見つかりません');
    }

    // ページ遷移を防ぐためのイベントリスナー
    window.addEventListener('beforeunload', function(e) {
        console.log('ページ遷移検知 - データ保存状態を確認');

        // データ保存中の場合、遷移を防ぐ
        if (window.liffData && window.liffData.imageDataUrl) {
            const savedData = localStorage.getItem('liffData');
            if (!savedData) {
                e.preventDefault();
                e.returnValue = 'データ保存中です。ページを離れますか？';
                console.log('データ保存中 - ページ遷移を防止');
            }
        }
    });

    // LIFF SDKのバージョンを確認
    if (typeof liff !== 'undefined') {
        console.log('LIFF SDK Version:', liff.getVersion());

        // build情報も出力（存在する場合）
        if (liff.build !== undefined) {
            console.log('LIFF SDK Build:', liff.build);
        }

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

            // LIFFアプリ内でのページ遷移防止
            if (liff.isInClient()) {
                console.log('LIFFアプリ内で実行中 - ページ遷移防止を有効化');

                // ブラウザの戻るボタンを無効化
                window.history.pushState(null, null, window.location.href);
                window.addEventListener('popstate', function() {
                    window.history.pushState(null, null, window.location.href);
                    console.log('戻るボタンが押されましたが、ページ遷移を防止しました');
                });
            }

            // LIFF初期化後にボタンイベントを登録
            if (!window.liffData) {
                window.liffData = {
                    imageDataUrl: null,
                    location: null
                };
            }

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

// コンソールログをファイルにダウンロードする関数
function downloadConsoleLog() {
    try {
        // localStorageからデバッグログを取得
        const debugLog = localStorage.getItem('debugLog');
        if (!debugLog) {
            alert('デバッグログがありません');
            return;
        }

        const debugArray = JSON.parse(debugLog);
        const logText = debugArray.map(entry => {
            const timestamp = new Date(entry.timestamp).toLocaleString();
            return `[${timestamp}] ${entry.title}:\n${JSON.stringify(entry.data, null, 2)}\n`;
        }).join('\n');

        // ファイル名を生成
        const now = new Date();
        const fileName = `console_log_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}.txt`;

        // ダウンロードリンクを作成
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('コンソールログをダウンロードしました:', fileName);
    } catch (e) {
        console.error('コンソールログダウンロードエラー:', e);
        alert('ダウンロードエラー: ' + e.message);
    }
}

// リアルタイムログ表示用のグローバル変数
window.logDisplayInterval = null;

// コンソールログを画面に表示する関数
function showConsoleLog() {
    try {
        // 既存のログ表示エリアを削除
        const existingLog = document.getElementById('console-log-display');
        if (existingLog) {
            existingLog.remove();
        }

        // 既存のインターバルをクリア
        if (window.logDisplayInterval) {
            clearInterval(window.logDisplayInterval);
        }

        // ログ表示エリアを作成
        const logDisplay = document.createElement('div');
        logDisplay.id = 'console-log-display';
        logDisplay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            height: 80%;
            background: white;
            border: 2px solid #007bff;
            border-radius: 10px;
            padding: 20px;
            overflow-y: auto;
            z-index: 10000;
            font-family: monospace;
            font-size: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;

        // ヘッダー部分
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #dee2e6;
        `;
        header.innerHTML = `
            <h3 style="margin: 0; color: #007bff;">リアルタイムログ表示</h3>
            <div>
                <button onclick="refreshLogDisplay()" style="background: #17a2b8; color: white; border: none; padding: 5px 10px; margin-right: 5px; border-radius: 3px; cursor: pointer;">更新</button>
                <button onclick="downloadConsoleLog()" style="background: #28a745; color: white; border: none; padding: 5px 10px; margin-right: 5px; border-radius: 3px; cursor: pointer;">ダウンロード</button>
                <button onclick="closeLogDisplay()" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">閉じる</button>
            </div>
        `;
        logDisplay.appendChild(header);

        // ログ内容エリア
        const logContent = document.createElement('div');
        logContent.id = 'log-content';
        logContent.style.cssText = `
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            white-space: pre-wrap;
            word-break: break-all;
            max-height: 400px;
            overflow-y: auto;
        `;
        logDisplay.appendChild(logContent);

        document.body.appendChild(logDisplay);

        // リアルタイム更新を開始
        updateLogDisplay();
        window.logDisplayInterval = setInterval(updateLogDisplay, 1000); // 1秒ごとに更新

        console.log('リアルタイムログ表示を開始しました');
    } catch (e) {
        console.error('コンソールログ表示エラー:', e);
        alert('ログ表示エラー: ' + e.message);
    }
}

// ログ表示を更新する関数
function updateLogDisplay() {
    try {
        const logContent = document.getElementById('log-content');
        if (!logContent) return;

        const logs = [];
        const timestamp = new Date().toLocaleString();

        // localStorageの状態
        const liffData = localStorage.getItem('liffData');
        if (liffData) {
            try {
                const parsed = JSON.parse(liffData);
                logs.push(`[${timestamp}] localStorage liffData:`);
                logs.push(`  画像データ: ${parsed.imageDataUrl ? 'あり (' + parsed.imageDataUrl.length + '文字)' : 'なし'}`);
                logs.push(`  位置情報: ${parsed.location ? 'あり (' + JSON.stringify(parsed.location) + ')' : 'なし'}`);
            } catch (e) {
                logs.push(`[${timestamp}] localStorage解析エラー: ${e.message}`);
            }
        } else {
            logs.push(`[${timestamp}] localStorage liffData: なし`);
        }

        // window.liffDataの状態
        if (window.liffData) {
            logs.push(`[${timestamp}] window.liffData:`);
            logs.push(`  画像データ: ${window.liffData.imageDataUrl ? 'あり (' + window.liffData.imageDataUrl.length + '文字)' : 'なし'}`);
            logs.push(`  位置情報: ${window.liffData.location ? 'あり (' + JSON.stringify(window.liffData.location) + ')' : 'なし'}`);
        } else {
            logs.push(`[${timestamp}] window.liffData: 未定義`);
        }

        // LIFF SDKの状態
        if (typeof liff !== 'undefined') {
            logs.push(`[${timestamp}] LIFF SDK:`);
            logs.push(`  バージョン: ${liff.getVersion()}`);
            logs.push(`  アプリ内: ${liff.isInClient()}`);
            logs.push(`  ログイン状態: ${liff.isLoggedIn()}`);
        } else {
            logs.push(`[${timestamp}] LIFF SDK: 未読み込み`);
        }

        // 最近の操作ログ
        logs.push(`[${timestamp}] 最近の操作:`);
        logs.push(`  カメラ撮影: ${typeof openCamera === 'function' ? '利用可能' : '未定義'}`);
        logs.push(`  位置情報取得: ${typeof getLocation === 'function' ? '利用可能' : '未定義'}`);

        logContent.textContent = logs.join('\n');
    } catch (e) {
        console.error('ログ表示更新エラー:', e);
    }
}

// ログ表示を手動更新
function refreshLogDisplay() {
    updateLogDisplay();
}

// ログ表示を閉じる
function closeLogDisplay() {
    const existingLog = document.getElementById('console-log-display');
    if (existingLog) {
        existingLog.remove();
    }
    if (window.logDisplayInterval) {
        clearInterval(window.logDisplayInterval);
        window.logDisplayInterval = null;
    }
}

// localStorageの状態を確認する関数
function checkLocalStorage() {
    console.log('=== localStorage状態確認 ===');

    try {
        const savedData = localStorage.getItem('liffData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            console.log('localStorageに保存されたデータ:', {
                hasImageData: !!parsedData.imageDataUrl,
                imageDataLength: parsedData.imageDataUrl ? parsedData.imageDataUrl.length : 0,
                hasLocation: !!parsedData.location,
                locationData: parsedData.location
            });
        } else {
            console.log('localStorageにデータがありません');
        }

        // localStorageの使用量を確認
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length;
            }
        }
        console.log('localStorage総使用量:', totalSize, '文字');

    } catch (e) {
        console.error('localStorage確認エラー:', e);
    }
}

// syslog出力用の関数
function logToSyslog(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] LIFF_APP: ${message}`;

    // コンソールに出力
    console.log(logMessage);

    // Android Logcatに出力（WebViewが対応している場合）
    if (window.Android && window.Android.log) {
        window.Android.log(logMessage);
    }

    // カスタムイベントとして発火（Android側でキャッチ可能）
    const event = new CustomEvent('liffLog', {
        detail: {
            message: message,
            level: level,
            timestamp: timestamp
        }
    });
    document.dispatchEvent(event);
}

// デバッグ用のsyslog出力関数
function debugToSyslog(data, title = 'DEBUG') {
    try {
        const logData = {
            title: title,
            data: data,
            timestamp: new Date().toISOString()
        };
        logToSyslog(`${title}: ${JSON.stringify(logData)}`, 'DEBUG');
    } catch (e) {
        logToSyslog(`デバッグ出力エラー: ${e.message}`, 'ERROR');
    }
}

// LINEアプリ内でのデバッグ用関数
function debugInLINE() {
    alert('=== LINEアプリ内デバッグ開始 ===');

    // 基本情報
    alert(`LIFF SDK: ${typeof liff !== 'undefined' ? '読み込み済み' : '未読み込み'}`);
    alert(`window.liffData: ${window.liffData ? '存在' : '未定義'}`);

    // localStorage確認
    const data = localStorage.getItem('liffData');
    alert(`localStorage liffData: ${data ? '存在' : 'なし'}`);

    // カメラ機能テスト
    if (typeof openCamera === 'function') {
        alert('openCamera関数: 利用可能');
    } else {
        alert('openCamera関数: 未定義');
    }
}

// グローバル関数として公開
window.downloadConsoleLog = downloadConsoleLog;
window.showConsoleLog = showConsoleLog;
window.checkLocalStorage = checkLocalStorage;
window.logToSyslog = logToSyslog;
window.debugToSyslog = debugToSyslog;
window.debugInLINE = debugInLINE;
window.updateLogDisplay = updateLogDisplay;
window.refreshLogDisplay = refreshLogDisplay;
window.closeLogDisplay = closeLogDisplay;


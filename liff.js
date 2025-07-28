// デバッグ情報表示関数
function showDebugInfo(title, data) {
    try {
        console.log('showDebugInfo called:', title, data);

        let debugDiv = document.getElementById('debug-info');
        if (!debugDiv) {
            debugDiv = createDebugDiv();
        }

        // デバッグ情報が非表示になっている場合は再表示
        if (debugDiv.style.display === 'none') {
            debugDiv.style.display = 'block';
        }

        const timestamp = new Date().toLocaleTimeString();

        // データを簡潔に表示
        let dataSummary = '';
        if (typeof data === 'object') {
            const keys = Object.keys(data);
            dataSummary = keys.map(key => `${key}: ${data[key]}`).join(', ');
        } else {
            dataSummary = String(data);
        }

        const debugInfo = `
            <div style="margin: 5px 0; padding: 5px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 3px; font-size: 9px;">
                <strong style="color: #007bff;">[${timestamp}] ${title}</strong><br>
                <span style="color: #6c757d; word-break: break-all;">${dataSummary}</span>
            </div>
        `;

        // 最新の5件のみを表示
        const existingContent = debugDiv.innerHTML;
        const headerMatch = existingContent.match(/<div[^>]*>デバッグ情報.*?<\/div>/);
        const header = headerMatch ? headerMatch[0] : '';

        // 既存のデバッグ情報を取得（ヘッダーを除く）
        const existingDebugItems = existingContent.replace(header, '').split('<div style="margin: 5px 0; padding: 5px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 3px; font-size: 9px;">');

        // 最新の4件 + 新しい1件 = 合計5件
        const maxItems = 4;
        const recentItems = existingDebugItems.slice(-maxItems).map(item =>
            '<div style="margin: 5px 0; padding: 5px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 3px; font-size: 9px;">' + item
        ).join('');

        debugDiv.innerHTML = header + recentItems + debugInfo;
        debugDiv.scrollTop = debugDiv.scrollHeight;

        console.log('Debug info displayed successfully');
    } catch (error) {
        console.error('showDebugInfo error:', error);
        alert('デバッグ情報表示エラー: ' + error.message);
    }
}

// デバッグ情報の表示/非表示を切り替えるグローバル関数
function toggleDebugInfo() {
    const debugDiv = document.getElementById('debug-info');
    if (debugDiv) {
        if (debugDiv.style.display === 'none') {
            debugDiv.style.display = 'block';
            console.log('デバッグ情報を表示しました');
        } else {
            debugDiv.style.display = 'none';
            console.log('デバッグ情報を非表示にしました');
        }
    } else {
        console.log('デバッグ情報エリアが見つかりません');
    }
}

function createDebugDiv() {
    try {
        console.log('createDebugDiv called');

        const debugDiv = document.createElement('div');
        debugDiv.id = 'debug-info';
        debugDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            max-height: 200px;
            background: white;
            border: 2px solid #007bff;
            border-radius: 5px;
            padding: 10px;
            overflow-y: auto;
            z-index: 10000;
            font-family: monospace;
            font-size: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            display: block;
        `;

        // ヘッダー部分に閉じるボタンを追加
        const headerHtml = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-weight: bold; color: #007bff;">
                <span>デバッグ情報</span>
                <button id="close-debug" onclick="document.getElementById('debug-info').style.display='none';" style="background: #dc3545; color: white; border: none; border-radius: 3px; padding: 4px 8px; font-size: 12px; cursor: pointer; font-weight: bold; min-width: 24px; min-height: 24px; display: inline-block; line-height: 1;">×</button>
            </div>
        `;
        debugDiv.innerHTML = headerHtml;

        // デバッグ情報を表示
        console.log('デバッグ情報エリアを作成しました');
        console.log('ヘッダーHTML:', headerHtml);

        // ボタンの存在を確認
        setTimeout(() => {
            const closeBtn = document.getElementById('close-debug');
            console.log('閉じるボタンの存在確認:', !!closeBtn);
            if (closeBtn) {
                console.log('閉じるボタンのスタイル:', closeBtn.style.cssText);
            }
        }, 100);

        // 閉じるボタンのイベントリスナーを追加
        setTimeout(() => {
            const closeBtn = document.getElementById('close-debug');
            if (closeBtn) {
                closeBtn.onclick = function() {
                    debugDiv.style.display = 'none';
                    console.log('デバッグ情報を非表示にしました');
                };
                console.log('閉じるボタンのイベントリスナーを設定しました');
            } else {
                console.error('閉じるボタンが見つかりません');
            }
        }, 100);

        document.body.appendChild(debugDiv);

        console.log('Debug div created successfully');
        return debugDiv;
    } catch (error) {
        console.error('createDebugDiv error:', error);
        alert('デバッグ情報エリア作成エラー: ' + error.message);
        return null;
    }
}

$(document).ready(function () {
    // liffId: LIFF URL "https://liff.line.me/xxx"のxxxに該当する箇所
    // LINE DevelopersのLIFF画面より確認可能
    var liffId = "2007732537-K8gaZLDe";

        // 基本的なデバッグ情報を表示
    showDebugInfo('ページ読み込み完了', {
        documentReady: true,
        timestamp: new Date().toISOString()
    });

    // localStorageの状況を詳細に確認
    showDebugInfo('localStorage状況確認', {
        localStorageKeys: Object.keys(localStorage),
        liffDataExists: !!localStorage.getItem('liffData'),
        liffDataSize: localStorage.getItem('liffData') ? localStorage.getItem('liffData').length : 0,
        totalLocalStorageSize: JSON.stringify(localStorage).length,
        sessionStorageKeys: Object.keys(sessionStorage),
        sessionStorageSize: JSON.stringify(sessionStorage).length,
        localStorageQuota: navigator.storage ? 'available' : 'not available',
        estimatedQuota: '5-10MB typical'
    });

    // テスト用のアラートも表示
    setTimeout(() => {
        alert('デバッグ機能テスト: ページ読み込み完了');
    }, 1000);

    initializeLiff(liffId);
});

// カメラ撮影
function openCamera() {
    console.log('openCamera called');

    // 関数開始時のデバッグ情報
    showDebugInfo('openCamera関数開始', {
        functionCalled: true,
        timestamp: new Date().toISOString(),
        liffAvailable: typeof liff !== 'undefined',
        isInClient: typeof liff !== 'undefined' ? liff.isInClient() : 'liff not available'
    });

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
    console.log('現在のliffData:', window.liffData);

    // liffDataが存在しない場合は初期化
    if (!window.liffData) {
        console.log('liffDataが存在しないため初期化します');
        window.liffData = {
            imageDataUrl: null,
            location: null,
            lineId: null
        };
    }

    // デバッグ情報を表示
    showDebugInfo('カメラ撮影開始', {
        liffDataExists: !!window.liffData,
        liffDataContent: window.liffData,
        isInClient: liff.isInClient(),
        isLoggedIn: liff.isLoggedIn(),
        photoPreviewElement: !!document.getElementById('photo-preview'),
        allElements: Array.from(document.querySelectorAll('*')).map(el => el.id).filter(id => id).join(', ')
    });

    // カメラAPIが利用可能か確認
    var available = false;
    try {
        // LIFF SDK 2.27.1ではカメラAPIが利用できない可能性があるため、
        // 代替手段としてファイル選択を使用
        available = true; // 一旦trueに設定
        console.log('カメラAPIの代替手段を使用します');
    } catch (e) {
        console.error('カメラAPI確認エラー:', e);
        alert('カメラAPIが利用できません: ' + e.message);
        return;
    }

    var preview = document.getElementById('photo-preview');
    preview.style.background = 'yellow';
    preview.innerHTML = 'カメラAPIの代替手段を使用します';

    if (!available) {
        alert('カメラAPIが利用できません。LINEアプリ内でアクセスしてください。');
        return;
    }

    // LINEアプリ内でのカメラ撮影処理
    try {
        console.log('カメラ撮影処理開始');

        // ファイル選択による代替手段
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.capture = 'camera'; // カメラを優先

        // タイムアウト処理を追加
        const timeoutId = setTimeout(() => {
            console.log('ファイル選択タイムアウト');
            alert('ファイル選択がタイムアウトしました。再度お試しください。');
        }, 30000); // 30秒タイムアウト

        fileInput.onchange = function(e) {
            clearTimeout(timeoutId); // タイムアウトをクリア
            console.log('ファイル選択イベント発生');
            const file = e.target.files[0];
            console.log('選択されたファイル:', file);

            // デバッグ情報を表示
            showDebugInfo('ファイル選択イベント発生', {
                fileExists: !!file,
                fileName: file ? file.name : 'なし',
                fileSize: file ? file.size : 0,
                fileType: file ? file.type : 'なし',
                fileValid: file && file.size > 0 && file.type.startsWith('image/')
            });

            if (file) {
                console.log('ファイルサイズ:', file.size);
                console.log('ファイルタイプ:', file.type);

                // liffDataが存在しない場合は初期化
                if (!window.liffData) {
                    console.log('ファイル選択時にliffDataが存在しないため初期化します');
                    window.liffData = {
                        imageDataUrl: null,
                        location: null,
                        lineId: null
                    };
                }

                // 既存の画像データのみをクリア（LINE IDは保持）
                console.log('既存の画像データをクリアします');
                try {
                    const currentData = localStorage.getItem('liffData');
                    if (currentData) {
                        const parsedData = JSON.parse(currentData);
                        // LINE IDを保持
                        const lineId = parsedData.lineId;
                        const location = parsedData.location;

                        // 画像データのみクリア
                        localStorage.removeItem('liffData');
                        sessionStorage.removeItem('liffData');

                        // LINE IDと位置情報を保持した新しいデータを作成
                        window.liffData = {
                            imageDataUrl: null,
                            location: location,
                            lineId: lineId
                        };
                        console.log('LINE IDと位置情報を保持しました');

                        // デバッグ情報を表示
                        showDebugInfo('既存データクリア', {
                            currentDataSize: currentData.length,
                            parsedDataKeys: Object.keys(parsedData),
                            hasLineId: !!lineId,
                            hasLocation: !!location,
                            newLiffData: JSON.stringify(window.liffData)
                        });
                    } else {
                        localStorage.removeItem('liffData');
                        sessionStorage.removeItem('liffData');

                        // デバッグ情報を表示
                        showDebugInfo('既存データなし', {
                            currentDataExists: false,
                            willInitialize: true
                        });
                    }
                    console.log('画像データをクリアしました');
                } catch (e) {
                    console.error('ストレージクリアエラー:', e);
                    showDebugInfo('ストレージクリアエラー', {
                        error: e.toString(),
                        errorMessage: e.message
                    });
                }

                // 即座にデータを保存（FileReader完了前）
                const tempDataUrl = URL.createObjectURL(file);
                console.log('一時的なdataUrl作成:', tempDataUrl);

                                // 即座にプレビューを表示
                const preview = document.getElementById('photo-preview');
                if (preview) {
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

                    // デバッグ情報を表示
                    showDebugInfo('即座プレビュー表示完了', {
                        previewElementExists: !!preview,
                        tempDataUrl: tempDataUrl.substring(0, 50) + '...',
                        previewInnerHTML: preview.innerHTML.substring(0, 100) + '...',
                        previewStyle: preview.style.cssText
                    });

                    // プレビューが実際に表示されているか確認
                    setTimeout(() => {
                        const imgElement = preview.querySelector('img');
                        showDebugInfo('プレビュー確認', {
                            imgElementExists: !!imgElement,
                            imgSrc: imgElement ? imgElement.src.substring(0, 50) + '...' : 'なし',
                            previewVisible: preview.offsetWidth > 0 && preview.offsetHeight > 0
                        });
                    }, 500);
                } else {
                    console.error('photo-preview要素が見つかりません');
                    showDebugInfo('エラー: photo-preview要素が見つかりません', {
                        error: 'photo-preview要素が見つかりません',
                        documentBody: document.body.innerHTML.substring(0, 200) + '...'
                    });
                }

                const reader = new FileReader();
                reader.onload = function(e) {
                    console.log('FileReader onload 実行');
                    const dataUrl = e.target.result;
                    console.log('dataUrl 生成完了, 長さ:', dataUrl.length);

                    // デバッグ情報を表示
                    showDebugInfo('FileReader onload 実行', {
                        dataUrlLength: dataUrl.length,
                        dataUrlStart: dataUrl.substring(0, 50) + '...',
                        dataUrlValid: dataUrl.startsWith('data:image/'),
                        readyState: e.target.readyState
                    });

                    // liffDataが存在しない場合は初期化
                    if (!window.liffData) {
                        console.log('FileReader完了時にliffDataが存在しないため初期化します');
                        window.liffData = {
                            imageDataUrl: null,
                            location: null,
                            lineId: null
                        };
                    }

                    // 画像データのみを更新（LINE IDは保持）
                    window.liffData.imageDataUrl = dataUrl;
                    console.log('画像データを更新しました');

                    // デバッグ情報を表示
                    showDebugInfo('画像データ更新', {
                        dataUrlLength: dataUrl.length,
                        dataUrlStart: dataUrl.substring(0, 50) + '...',
                        liffDataImageDataUrl: !!window.liffData.imageDataUrl,
                        liffDataKeys: Object.keys(window.liffData),
                        liffDataSize: JSON.stringify(window.liffData).length
                    });

                    // sessionStorageとlocalStorageの両方に保存
                    try {
                        sessionStorage.setItem('liffData', JSON.stringify(window.liffData));
                        localStorage.setItem('liffData', JSON.stringify(window.liffData));
                        console.log('データをsessionStorageとlocalStorageに保存しました');

                        // デバッグ情報を表示
                        showDebugInfo('ストレージ保存完了', {
                            sessionStorageSaved: !!sessionStorage.getItem('liffData'),
                            localStorageSaved: !!localStorage.getItem('liffData'),
                            sessionStorageSize: sessionStorage.getItem('liffData') ? sessionStorage.getItem('liffData').length : 0,
                            localStorageSize: localStorage.getItem('liffData') ? localStorage.getItem('liffData').length : 0,
                            liffDataImageDataUrl: !!window.liffData.imageDataUrl,
                            imageDataUrlLength: window.liffData.imageDataUrl ? window.liffData.imageDataUrl.length : 0,
                            totalDataSize: JSON.stringify(window.liffData).length,
                            imageDataPercentage: window.liffData.imageDataUrl ? Math.round((window.liffData.imageDataUrl.length / JSON.stringify(window.liffData).length) * 100) : 0,
                            liffDataBeforeSave: JSON.stringify(window.liffData),
                            localStorageAfterSave: localStorage.getItem('liffData'),
                            localStorageQuotaExceeded: localStorage.getItem('liffData') ? localStorage.getItem('liffData').length > 5000000 : false,
                            estimatedQuota: '5MB typical limit',
                            localStorageKeys: Object.keys(localStorage),
                            sessionStorageKeys: Object.keys(sessionStorage)
                        });

                        // 保存後の確認
                        setTimeout(() => {
                            const savedData = localStorage.getItem('liffData');
                            showDebugInfo('保存後確認', {
                                localStorageExists: !!savedData,
                                savedDataSize: savedData ? savedData.length : 0,
                                savedDataParsed: savedData ? JSON.parse(savedData) : null,
                                savedDataKeys: savedData ? Object.keys(JSON.parse(savedData)) : [],
                                hasImageData: savedData ? JSON.parse(savedData).imageDataUrl : false
                            });
                        }, 500);
                    } catch (e) {
                        console.error('ストレージ保存エラー:', e);
                        showDebugInfo('ストレージ保存エラー', {
                            error: e.toString(),
                            errorMessage: e.message
                        });
                    }

                    // 最終的なプレビューを表示
                    const preview = document.getElementById('photo-preview');
                    if (preview) {
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

                        // デバッグ情報を表示
                        showDebugInfo('最終プレビュー表示完了', {
                            previewElementExists: !!preview,
                            dataUrlLength: dataUrl.length,
                            dataUrlStart: dataUrl.substring(0, 50) + '...',
                            liffDataImageDataUrl: !!window.liffData.imageDataUrl,
                            localStorageSaved: !!localStorage.getItem('liffData'),
                            previewInnerHTML: preview.innerHTML.substring(0, 200) + '...',
                            previewStyle: preview.style.cssText
                        });

                        // 画像要素の確認
                        setTimeout(() => {
                            const imgElement = preview.querySelector('img');
                            showDebugInfo('最終プレビュー確認', {
                                imgElementExists: !!imgElement,
                                imgSrc: imgElement ? imgElement.src.substring(0, 50) + '...' : 'なし',
                                imgWidth: imgElement ? imgElement.offsetWidth : 0,
                                imgHeight: imgElement ? imgElement.offsetHeight : 0,
                                previewWidth: preview.offsetWidth,
                                previewHeight: preview.offsetHeight
                            });
                        }, 1000);
                    } else {
                        console.error('最終プレビュー表示時にphoto-preview要素が見つかりません');
                        showDebugInfo('エラー: 最終プレビュー表示時にphoto-preview要素が見つかりません', {
                            error: 'photo-preview要素が見つかりません'
                        });
                    }

                    // 成功メッセージを表示（アラートではなく）
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

                    // データが正しく保存されているか確認
                    setTimeout(() => {
                        const savedData = localStorage.getItem('liffData');
                        console.log('保存確認 - localStorage:', savedData ? '保存済み' : '未保存');
                        const sessionData = sessionStorage.getItem('liffData');
                        console.log('保存確認 - sessionStorage:', sessionData ? '保存済み' : '未保存');
                    }, 1000);
                };

                reader.onerror = function(e) {
                    console.error('FileReader エラー:', e);

                    // デバッグ情報を表示
                    showDebugInfo('FileReader エラー', {
                        error: e.toString(),
                        errorType: e.type,
                        errorTarget: e.target ? e.target.readyState : 'unknown'
                    });

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

                    // デバッグ情報を表示
                    showDebugInfo('FileReader 中断', {
                        error: e.toString(),
                        errorType: e.type
                    });

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
            } else {
                console.log('ファイルが選択されていません');
                const noFileMsg = document.createElement('div');
                noFileMsg.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #6c757d;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    z-index: 1000;
                    font-weight: bold;
                `;
                noFileMsg.textContent = 'ファイルが選択されていません';
                document.body.appendChild(noFileMsg);

                setTimeout(() => {
                    if (noFileMsg.parentNode) {
                        noFileMsg.parentNode.removeChild(noFileMsg);
                    }
                }, 3000);
            }
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

// LINE ID取得
// function getLineId() {
//     console.log('LINE ID取得開始');

//     if (!liff.isLoggedIn()) {
//         console.log('LINEにログインしていません');
//         return;
//     }

//     console.log('liff.isLoggedIn():', liff.isLoggedIn());
//     console.log('liff.isInClient():', liff.isInClient());

//     // プロフィール情報を取得
//     liff.getProfile()
//         .then(profile => {
//             console.log('プロフィール情報:', profile);

//             // LINE IDを保存
//             window.liffData.lineId = profile.userId;
//             console.log('LINE ID:', profile.userId);

//             // sessionStorageとlocalStorageの両方に保存
//             try {
//                 sessionStorage.setItem('liffData', JSON.stringify(window.liffData));
//                 localStorage.setItem('liffData', JSON.stringify(window.liffData));
//                 console.log('LINE IDをストレージに保存しました');
//             } catch (e) {
//                 console.error('ストレージ保存エラー:', e);
//             }

//             // プレビューを表示
//             const lineIdPreview = document.getElementById('line-id-preview');
//             if (lineIdPreview) {
//                 lineIdPreview.innerHTML = `LINE ID: ${profile.userId}`;
//                 console.log('LINE IDプレビューを表示しました');
//             } else {
//                 console.error('line-id-preview要素が見つかりません');
//             }

//             // 成功メッセージを表示
//             const successMsg = document.createElement('div');
//             successMsg.style.cssText = `
//                 position: fixed;
//                 top: 20px;
//                 left: 50%;
//                 transform: translateX(-50%);
//                 background: #28a745;
//                 color: white;
//                 padding: 10px 20px;
//                 border-radius: 5px;
//                 z-index: 1000;
//                 font-weight: bold;
//             `;
//             successMsg.textContent = 'LINE IDを取得しました！';
//             document.body.appendChild(successMsg);

//             setTimeout(() => {
//                 if (successMsg.parentNode) {
//                     successMsg.parentNode.removeChild(successMsg);
//                 }
//             }, 3000);
//         })
//         .catch(err => {
//             console.error('LINE ID取得エラー:', err);
//             console.error('エラー詳細:', err.message);

//             // エラーメッセージを表示
//             const errorMsg = document.createElement('div');
//             errorMsg.style.cssText = `
//                 position: fixed;
//                 top: 20px;
//                 left: 50%;
//                 transform: translateX(-50%);
//                 background: #dc3545;
//                 color: white;
//                 padding: 10px 20px;
//                 border-radius: 5px;
//                 z-index: 1000;
//                 font-weight: bold;
//             `;
//             errorMsg.textContent = 'LINE ID取得に失敗しました: ' + err.message;
//             document.body.appendChild(errorMsg);

//             setTimeout(() => {
//                 if (errorMsg.parentNode) {
//                 errorMsg.parentNode.removeChild(errorMsg);
//                 }
//             }, 5000);
//         });
// }

// データクリア
function clearAllData() {
    console.log('データクリア開始');

    // デバッグ情報を表示
    showDebugInfo('データクリア開始', {
        liffDataBeforeClear: window.liffData,
        localStorageBeforeClear: localStorage.getItem('liffData') ? 'exists' : 'not exists',
        sessionStorageBeforeClear: sessionStorage.getItem('liffData') ? 'exists' : 'not exists'
    });

    // ストレージをクリア
    try {
        localStorage.removeItem('liffData');
        sessionStorage.removeItem('liffData');
        console.log('ストレージをクリアしました');
    } catch (e) {
        console.error('ストレージクリアエラー:', e);
        showDebugInfo('ストレージクリアエラー', {
            error: e.toString()
        });
    }

    // メモリ上のデータをクリア
    window.liffData = {
        imageDataUrl: null,
        location: null,
        lineId: null
    };

    // プレビューをクリア
    const photoPreview = document.getElementById('photo-preview');
    if (photoPreview) {
        photoPreview.style.background = '';
        photoPreview.innerHTML = '';
    }

    const locationPreview = document.getElementById('location-preview');
    if (locationPreview) {
        locationPreview.innerHTML = '';
    }

    const lineIdPreview = document.getElementById('line-id-preview');
    if (lineIdPreview) {
        lineIdPreview.innerHTML = '';
    }

    // コメント欄もクリア
    $('#comment').val('');

    // 成功メッセージを表示
    const successMsg = document.createElement('div');
    successMsg.style.cssText = `
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
    successMsg.textContent = 'データをクリアしました！';
    document.body.appendChild(successMsg);

    setTimeout(() => {
        if (successMsg.parentNode) {
            successMsg.parentNode.removeChild(successMsg);
        }
    }, 3000);

    console.log('データクリア完了');
}

function initializeLiff(liffId) {
    console.log('LIFF初期化開始');

    // ページリロード検知
    window.addEventListener('beforeunload', function() {
        console.log('ページリロード検知 - データを保存');
        if (window.liffData) {
            try {
                localStorage.setItem('liffData', JSON.stringify(window.liffData));
                console.log('localStorageにデータを保存しました');
            } catch (e) {
                console.error('localStorage保存エラー:', e);
            }
        }
    });

        // データ復元処理を関数化
    function restoreData() {
        let savedData = null;

        // データ復元開始時のlocalStorage状況を確認
        showDebugInfo('データ復元開始', {
            localStorageKeys: Object.keys(localStorage),
            sessionStorageKeys: Object.keys(sessionStorage),
            liffDataInLocalStorage: !!localStorage.getItem('liffData'),
            liffDataInSessionStorage: !!sessionStorage.getItem('liffData'),
            localStorageLiffDataSize: localStorage.getItem('liffData') ? localStorage.getItem('liffData').length : 0,
            sessionStorageLiffDataSize: sessionStorage.getItem('liffData') ? sessionStorage.getItem('liffData').length : 0
        });

        // まずsessionStorageから復元を試行
        if (sessionStorage.getItem('liffData')) {
            try {
                savedData = JSON.parse(sessionStorage.getItem('liffData'));
                console.log('sessionStorageからデータを復元:', savedData);

                // デバッグ情報を表示
                showDebugInfo('sessionStorage復元', {
                    sessionStorageExists: true,
                    savedDataKeys: savedData ? Object.keys(savedData) : [],
                    hasImageData: savedData && savedData.imageDataUrl ? true : false,
                    imageDataLength: savedData && savedData.imageDataUrl ? savedData.imageDataUrl.length : 0
                });
            } catch (e) {
                console.error('sessionStorage復元エラー:', e);
                showDebugInfo('sessionStorage復元エラー', {
                    error: e.toString(),
                    errorMessage: e.message
                });
            }
        }

        // sessionStorageにない場合はlocalStorageから復元
        if (!savedData && localStorage.getItem('liffData')) {
            try {
                savedData = JSON.parse(localStorage.getItem('liffData'));
                console.log('localStorageからデータを復元:', savedData);

                // デバッグ情報を表示
                showDebugInfo('localStorage復元', {
                    localStorageExists: true,
                    savedDataKeys: savedData ? Object.keys(savedData) : [],
                    hasImageData: savedData && savedData.imageDataUrl ? true : false,
                    imageDataLength: savedData && savedData.imageDataUrl ? savedData.imageDataUrl.length : 0,
                    imageDataStart: savedData && savedData.imageDataUrl ? savedData.imageDataUrl.substring(0, 50) + '...' : 'なし',
                    savedDataString: JSON.stringify(savedData).substring(0, 200) + '...',
                    savedDataFull: JSON.stringify(savedData),
                    localStorageRaw: localStorage.getItem('liffData')
                });
            } catch (e) {
                console.error('localStorage復元エラー:', e);
                showDebugInfo('localStorage復元エラー', {
                    error: e.toString(),
                    errorMessage: e.message
                });
            }
        }

        if (savedData) {
            window.liffData = savedData;

            // デバッグ情報を表示
            showDebugInfo('データ復元完了', {
                liffDataRestored: !!window.liffData,
                hasImageData: !!window.liffData.imageDataUrl,
                imageDataLength: window.liffData.imageDataUrl ? window.liffData.imageDataUrl.length : 0,
                hasLocation: !!window.liffData.location,
                hasLineId: !!window.liffData.lineId
            });

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

            // if (window.liffData.lineId) {
            //     const lineIdPreview = document.getElementById('line-id-preview');
            //     if (lineIdPreview) {
            //         lineIdPreview.innerHTML = `LINE ID: ${window.liffData.lineId}`;
            //         console.log('LINE IDプレビューを復元しました');
            //     }
            // }
        } else {
            console.log('保存されたデータが見つかりません');

            // デバッグ情報を表示
            showDebugInfo('保存データなし', {
                sessionStorageEmpty: !sessionStorage.getItem('liffData'),
                localStorageEmpty: !localStorage.getItem('liffData'),
                willInitialize: true
            });

            // 初回アクセス時はliffDataを初期化
            window.liffData = {
                imageDataUrl: null,
                location: null,
                lineId: null
            };
            console.log('liffDataを初期化しました');
        }
    }

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

            // デバッグ情報を表示
            showDebugInfo('LIFF初期化成功', {
                liffInitialized: true,
                timestamp: new Date().toISOString()
            });

            // LIFFの準備が完了するまで待つ
            return liff.ready;
        })
        .then(() => {
            console.log('LIFF準備完了');

            // デバッグ情報を表示
            showDebugInfo('LIFF準備完了', {
                liffReady: true,
                timestamp: new Date().toISOString()
            });

            // LIFF初期化完了後にデータを復元
            restoreData();

            // LIFF初期化後にボタンイベントを登録
            if (!window.liffData) {
                window.liffData = {
                    imageDataUrl: null,
                    location: null,
                    lineId: null
                };
            }

            $('#camera-btn').on('click', function() {
                showDebugInfo('カメラボタンクリック', {
                    buttonClicked: true,
                    timestamp: new Date().toISOString(),
                    buttonElement: !!document.getElementById('camera-btn'),
                    jqueryLoaded: typeof $ !== 'undefined'
                });
                openCamera();
            });

            // ボタンが正しく設定されているか確認
            showDebugInfo('カメラボタン設定完了', {
                buttonExists: !!document.getElementById('camera-btn'),
                jqueryLoaded: typeof $ !== 'undefined',
                eventHandlers: $._data ? $._data(document.getElementById('camera-btn'), 'events') : 'unavailable'
            });

            $('#location-btn').on('click', function() {
                getLocation();
            });

            // クリアボタンの処理
            $('#clear-btn').on('click', function() {
                clearAllData();
            });

            // LINE IDを取得（一度だけ）
            // if (!window.liffData.lineId) {
            //     getLineId();
            // } else {
            //     console.log('LINE IDは既に取得済みです:', window.liffData.lineId);
            // }

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

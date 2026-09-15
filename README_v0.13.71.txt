Alpine Team Manager v0.13.71

変更内容
- 軽微な新バージョン検出時に実際の自動更新を実行
- Service Worker と Cache Storage を更新し、localStorage のチームデータは保持
- 更新中はヘッダーに「vXへ更新中…」「更新完了・再起動します…」を表示
- 公開ファイルの反映待ち時は更新ループを防止して案内表示
- restartRequired=true の大型更新は従来どおりバックアップ案内
- UI配置変更なし

GitHub Pages 更新対象
- index.html
- app.js
- version.json

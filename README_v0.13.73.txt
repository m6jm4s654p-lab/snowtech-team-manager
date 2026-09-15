Alpine Team Manager v0.13.73

変更内容
- ヘッダーのバージョン表示を固定文字列から APP_VERSION 自動連動へ変更
- APP_VERSION / version.json / Service Worker を v0.13.73 に更新
- UIレイアウトや既存機能は変更なし
- localStorage のチームデータは削除しない

GitHub Pages 更新対象
- index.html
- app.js
- version.json
- sw.js

確認ポイント
- 起動後、ヘッダー左上が v0.13.73 と表示される
- version.json は 0.13.73
- 今後は APP_VERSION を更新すればヘッダー表示も自動で追従する

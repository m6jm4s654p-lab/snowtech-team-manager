Alpine Team Manager v0.13.69

変更内容
- アプリ起動時に毎回 version.json をキャッシュ無効で確認。
- 最新版なら何も表示しません。
- 軽微な更新は「間もなく最新バージョンに変更になります」と案内し、そのまま使用可能。
- restartRequired=true の更新は、バックアップ作成・URLコピー・更新手順・今回はそのまま使用を表示。
- 再起動が必要な更新ではメインデータのバックアップを明示的に促します。

version.json 運用
- 軽微な更新: restartRequired=false
- ホーム画面からの削除・再追加等が必要な更新: restartRequired=true

GitHub更新対象
- index.html
- app.js
- version.json

Alpine Team Manager v0.13.72

更新基盤修正版
- Service Workerをv0.13.72として更新
- version.jsonは常にネットワーク確認
- ナビゲーションはnetwork-first
- 軽微更新時は新Service Worker取得→公開index確認→再起動
- 公開indexが最新版であることを確認できるまで「更新完了」と表示しない
- localStorageのチーム・選手・大会・年間予定データは削除しない
- 更新ループ防止（同一セッション2回まで）

重要：v0.13.72導入時は index.html / app.js / version.json / sw.js の4ファイルをGitHubへ更新してください。
今後v0.13.73以降の軽微更新で自動更新を検証するための基盤版です。

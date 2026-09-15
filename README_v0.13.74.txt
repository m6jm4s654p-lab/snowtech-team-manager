Alpine Team Manager v0.13.74
更新日: 2026-09-15

【修正内容】
- 全国ランキングの K2 / 一般 判定を「現在シーズン基準」に修正
- SAJポイントデータが前シーズンへフォールバックしても、カテゴリー判定は前シーズンへ戻さない
- 例: 2026/27シーズンでは 2010/09/16 生まれは「一般」
- 所属選手の全国ランキングと全国TOP30で同じ現在シーズン基準を使用
- 全国ランキング端末キャッシュを v2 に更新し、旧K2判定を引き継がない
- APP_VERSION / version.json / Service Worker を v0.13.74 に更新
- UIレイアウト変更なし
- チーム・選手・大会等の保存データは削除しない

【GitHub Pages 更新対象】
index.html
app.js
version.json
sw.js

【Cloudflare Worker 更新対象】
worker.js

worker.js を Wrangler プロジェクトへ上書き後:
npx wrangler deploy

【確認項目】
1. アプリ表示が v0.13.74
2. 2010/09/16 生まれの選手が「全国ランク（一般）」になる
3. 全国TOP30のK2/一般区分も現在シーズン基準
4. 既存チームデータが保持されている

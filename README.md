## v0.13.55

- LINE共有で長いURLを渡す方式を廃止。
- Cloudflare Workers KVへ7日間だけバックアップを保存し、LINEには短い共有リンクだけを渡す方式へ変更。
- 受信側は共有リンクを開くとバックアップを取得し、確認後に端末へ取り込む。
- v0.13.54の旧共有リンク読込にも互換対応。
- TOP30、チームランキング、SAJ順位計算ロジックは変更なし。

### デプロイ
`npx wrangler deploy`

初回は `BACKUP_SHARE` KV namespace がWrangler 4の自動プロビジョニングで作成され、wrangler.tomlへIDが反映されます。

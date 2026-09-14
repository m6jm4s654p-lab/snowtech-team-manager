# v0.13.58

- Supporter用データ更新ファイルの共有メッセージにAlpine Team Supporter公開URLを追加。
- LINE等へ「更新ファイル＋Supporter URL」を同時に共有。
- 更新ファイル形式はv0.13.57と同じ .txt。
- Worker変更なし。

# v0.13.57

- Supporter用データ更新ファイルをLINE互換性の高い .txt（text/plain）形式へ変更。内容は従来と同じJSONデータです。

# v0.13.56

- Alpine Team Supporter用データ更新ファイル（.atsdata）の直接共有/書き出しを追加。
- Supporter更新データはサーバー保存なし。
- 既存機能は維持。

## v0.13.55

- LINE共有で長いURLを渡す方式を廃止。
- Cloudflare Workers KVへ7日間だけバックアップを保存し、LINEには短い共有リンクだけを渡す方式へ変更。
- 受信側は共有リンクを開くとバックアップを取得し、確認後に端末へ取り込む。
- v0.13.54の旧共有リンク読込にも互換対応。
- TOP30、チームランキング、SAJ順位計算ロジックは変更なし。

### デプロイ
`npx wrangler deploy`

初回は `BACKUP_SHARE` KV namespace がWrangler 4の自動プロビジョニングで作成され、wrangler.tomlへIDが反映されます。

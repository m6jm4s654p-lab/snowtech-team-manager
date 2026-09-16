Alpine Team Manager v0.13.87

Supporter配信通信修正:
- Content Security PolicyへSupporter配信サーバーを追加
- iPhone／Safariで「LOAD FAILED」となり配信できない問題を修正

Supporterサーバー連携:
- Managerから最新のSupporter閲覧データをサーバーへ直接配信
- 登録済みSupporterは起動時に自動更新
- 利用を許可する端末向けの専用招待URLを発行・共有
- チームIDとManager配信キーはManager端末内に保存
- Supporterサーバー管理画面からチームの利用停止・再開が可能

その他トレーニングバーン選択修正:
- 「ホーム以外で練習」を開いた時、登録済みトレーニングバーンを明示的なプルダウンで表示
- iPhone/PWAで候補が見えにくい datalist 方式を廃止
- 登録済みバーンを選ぶと練習場所入力欄へ自動反映
- 「その他の場所を直接入力」も選択可能
- 練習場所入力欄へ任意の場所を直接入力することも引き続き可能
- 既にホーム以外の練習場所が設定済みの場合は、その内容を再表示
- v0.13.84までの機能を維持
- Cloudflare Worker再デプロイ不要

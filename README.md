# SnowTech Alpine Team Manager v0.3.1

## 変更点
- 選手登録は「SAJ競技者番号 → 選手登録」のワンタッチ方式
- 氏名、所属、Birth、SL/GS/SG/DH/SCポイントをSAJ公開ポイントリストから取得
- 登録済み選手の一括SAJ更新
- GitHub PagesからのCORS回避用 Cloudflare Worker を同梱

## 1. Cloudflare Worker
このフォルダで:

```bash
npx wrangler deploy
```

表示された `https://snowtech-saj-api.xxxxx.workers.dev` をコピー。

## 2. GitHub Pages
`index.html`, `manifest.webmanifest`, `sw.js`, `icon.svg` をGitHub Pagesのリポジトリ直下に配置。

## 3. アプリ設定
SnowTech → 管理 → `SAJ連携API URL` にWorker URLを入力 → 保存。

以後:
`選手 → 選手追加 → SAJ競技者番号 → 選手登録`

## 注意
- SAJの公開ページのみ参照します。
- SAJサイトのHTML構造変更時はWorker側のパーサ修正が必要になる場合があります。
- 学年はBirthだけで確定せず、必要ならアプリ上で手動補正します。


## v0.3.1 SAJ年度検索
- SAJ競技者番号は年度共通として扱います。
- 当年度の最新発行済みポイントリストを優先検索。
- 当年度に見つからなければ前年度を自動検索。
- 2026年9月時点では 2026/2027 (season_code=2027) → 2025/2026 (season_code=2026) の順です。
- APIレスポンスに seasonCode / seasonLabel を追加しています。


## v0.3.2
- SAJ選手登録をポイントリスト依存から変更
- `/alpine/biography/{SAJ番号}` を本人情報の主データ源に変更
- ポイントリスト未掲載でも選手登録可能
- 当年度→前年度の公式ポイントリストを補助参照
- Biographyの過去大会履歴も選手詳細へ保存
- テスト基準: 03028493


## v0.3.3
- SAJ連携APIを `https://snowtech-saj-api.take6583.workers.dev` にデフォルト固定
- 旧バージョンのLocalStorageが残っていてAPI URLが空でも自動的にデフォルトAPIを使用


## v0.3.4
- SAJ biographyのプロフィール解析を実HTML構造に合わせて修正
- 氏名・ローマ字名・生年月日・性別・所属をフラットテキストから取得
- テスト番号: 03028493

## v0.3.5
- SAJ biographyプロフィール解析を再修正
- 正規表現の不要なエスケープを除去
- SAJ公開ページの実際の表示順
  `SAJ番号 → FIS番号 → 氏名 → ローマ字名 → 生年月日/性別 → 所属`
  に合わせて解析
- 03028493 を基準にプロフィール取得を修正

## v0.3.6
- SAJポイント取得を強化
- 当年度 → 前年度の順で検索
- ポイントリスト画面に加え、発行カレンダー上のCSV/TXT等ダウンロードファイルも検索
- SAJ競技者番号をダウンロードデータ内から直接検索
- `/api/debug-points?saj=XXXXXXXX` を追加
- デバッグAPIでカレンダーURL、リンク数、候補ダウンロードURL、選手番号一致状況、解決結果を確認可能

## v0.3.7
- SAJ取得データの生年月日・性別を選手データへ保存
- 既存選手も「登録選手をSAJ更新」で生年月日・性別を更新
- 選手編集画面に生年月日・性別を追加
- 所属選手画面を「男子」「女子」に分離
- 性別未取得の旧データは別枠に表示し、SAJ更新を案内
- 選手一覧に生年月日を表示
- 選手詳細に性別・生年月日を表示

## v0.3.8
- チームランキングを男子／女子に分離
- 大会ページに「公認大会情報取得」を追加
- Cloudflare Workerに `/api/saj-competitions?season=YYYY` を追加
- SAJアルペン大会カレンダーから大会名・日程・開催地・種目・大会URLを取得
- 参加希望大会をチェックしてSnowTech大会管理へ一括登録
- 取り込んだ大会は年間予定へ自動反映
- SAJ大会キーで二重登録を防止

## v0.3.9
- SAJ大会カレンダー取得方式を修正
- 推測したクエリパラメータを廃止
- SAJ大会カレンダーHTMLの検索フォームを解析し、実際のselect name/valueを利用
- GET/POSTのフォームmethod/actionにも追従
- `/api/debug-competition-calendar` を追加
- デバッグAPIでフォームmethod/action/select名/シーズンoptionを確認可能

## v0.4.0
- SAJ公認大会取得の0件問題を修正
- SAJ `/search_competitions` はシーズンだけでなく競技選択が必須
- 検索フォームから「アルペン / Alpine」の実際のoption valueを自動検出
- シーズン + アルペンを必ずセットして検索
- フォームactionで0件の場合は `/search_competitions` へ同じ実フィールドを直接GET
- debug APIに detectedSeasonField / detectedAlpineField を追加

## v0.4.1
- SAJ大会リンクの2形式に対応
  - /alpine/YYYY/competition/ID
  - /alpine/competition/ID
- 大会リンクがtable row外にある場合のfallback追加
- 大会名がリンク文字列ではなく通常セルの場合の推定を追加
- 0件時に diagnostic をAPIレスポンスへ付加
  - htmlLength
  - hasNoSchedule
  - hasCompetitionText
  - competitionLinkCount
  - sampleCompetitionLinks
  - visibleExcerpt

## v0.4.2
- ヘッダー右上にバージョン `v0.4.2` を常時表示
- SAJ公認大会画面に地域単位フィルターを追加
- 地域: 北海道 / 東北 / 関東 / 甲信越 / 北陸 / 東海 / 近畿 / 中国 / 四国 / 九州・沖縄
- 初期状態は全地域ON
- チェック状態はLocalStorageへ保存
- 全地域ON / 全地域OFFボタン追加
- 全国取得データは保持したまま表示だけ地域フィルター
- 開催県を判定できない大会は誤除外を避けるため表示

## v0.4.3
- SAJ大会カレンダーの「月」を必須検索条件として扱う
- liveフォームから月selectを自動検出
- 1月〜12月の実option値をWorker内部で順番に検索
- 月ごとの大会結果を統合し、大会キーで重複除去
- ユーザー側は従来どおり1回の「公認大会情報取得」で全国一覧を取得
- 地域フィルターは取得後の表示絞り込みとして維持
- 0件時diagnosticに月別検索結果を追加
- 成功時monthSummaryをAPIレスポンスへ付加

## v0.4.4
- SAJ大会検索フォームをfield nameで厳密に特定
- `/search_competitions` を大会取得の主経路へ変更
- `search_prefecture=すべて` を送信しない
- 開催地未指定を「全国」として検索
- 月別巡回は維持
- diagnosticsにvalidation/noScheduleを追加
- ヘッダー表示 v0.4.4

## v0.4.5
- SAJ開催地未指定では全国検索にならない挙動へ対応
- Worker APIを1か月単位に変更: `/api/saj-competitions?season=2026&month=2`
- 1回のWorker内で47都道府県を実際のselect option値で巡回
- SnowTech画面側が1〜12月を順番に取得し全国大会を統合
- 大会キーで重複除去
- 取得途中も部分結果を画面表示
- 地域ON/OFFフィルターは従来どおり取得後に適用
- `/search_competitions` から大会カレンダーへリダイレクトされる挙動を正常扱い

## v0.4.6
- Cloudflare Workers Free の外部subrequest上限 50/request 対応
- 47都道府県を3バッチ（16/16/15）に分割
- API: `/api/saj-competitions?season=2026&month=2&batch=1`
- 1バッチ最大約33 subrequests（base取得1 + 16県×redirect込み2）
- SnowTech側は12か月×3バッチ=36回を自動実行
- 部分取得結果を随時一覧へ表示
- batchInfo diagnostic追加
- ヘッダー v0.4.6

## v0.4.7
- SAJ大会検索GETで空文字パラメータを削除しないよう修正
- `search_discipline=` を明示送信
- SAJフォームの実際の検索URL構造に合わせる
- 47都道府県3バッチ方式は維持
- ヘッダー v0.4.7

## v0.4.8
- SAJ `/search_competitions` のセッションCookie引継ぎに対応
- HTTP 301/302/303/307/308をWorker側で手動追跡
- `Set-Cookie` をCookie jarへ保持し、リダイレクト先へ `Cookie` として送信
- ブラウザで検索する時と同じセッション状態を再現
- `search_discipline=` 空文字送信を維持
- 2月・山形県を診断プローブとして常時 `months` に記録
- 診断に redirectCount / sessionCookieCount を追加（Cookie値は出力しない）
- 47都道府県3バッチ方式を維持
- ヘッダー v0.4.8

## v0.4.9
- SAJ大会検索の競技を常にアルペンへ固定
- `search_sports_code=AL` を各検索リクエストで明示的に上書き
- `search_discipline=` は空欄のまま（アルペン全種目取得）
- 診断結果に `sportsCode:"AL"` を追加
- ヘッダー v0.4.9

## v0.5.0
- 診断用 `/api/debug-competition-js` を追加
- 大会カレンダーHTML内の script src / $.ajax / $.get / $.post / fetch / url: を抽出
- SAJカレンダー内部の大会データ取得先を特定するための診断
- `search_sports_code=AL` 強制指定は維持
- 既存の47都道府県3バッチ方式は維持
- ヘッダー v0.5.0

## v0.5.1
- SAJ大会取得をHTMLパース方式から内部JSON API方式へ全面変更
- SAJカレンダー自身が使用する `/api/search_competitions` をGET
- `sports_code=AL` を常時固定
- `prefecture=` で全国、`month=1..12` を月別取得
- `data.competitions` をSnowTech大会形式へ変換
- racesからGS/SL等の種目を集約
- Cookie / HTMLリダイレクト / 47都道府県3バッチ処理を大会取得本線から廃止
- 診断 `/api/debug-competition-api?season=2026&month=2` を追加
- ヘッダー v0.5.1

## v0.5.2
- v0.5.1生成時に残っていた旧v0.4系大会取得ブロックを完全削除
- `Expected "}" but found "if"` のWorkerビルドエラーを修正
- `/api/saj-competitions` はSAJ内部JSON API `/api/search_competitions` 方式のみを使用
- `sports_code=AL`（アルペン）固定
- worker.js / index.html JavaScript 構文チェック済み

## v0.5.3
- SAJ公認大会一覧の大会名をクリック可能に変更
- クリックするとSAJ競技データバンクの実際の大会情報ページを新しいタブで開く
- `target="_blank"` + `rel="noopener noreferrer"`
- URL未取得時は通常テキスト表示
- ヘッダー v0.5.3

## v0.5.4
- 年間予定表をA4横1枚向けの11月〜4月カレンダー形式へ追加
- 縦軸=日付、横軸=月（11月 / 12月 / 1月 / 2月 / 3月 / 4月）
- 各セルに `1日(月)` と当日の予定を表示
- 予定一覧に加え、年間予定表プレビューを画面表示
- 表示シーズン選択を追加（YYYY/YYYY+1）
- 印刷時は年間予定一覧を非表示にし、A4横の年間予定表を優先表示
- ボタン名を `A4年間予定表PDF` へ変更
- ヘッダー v0.5.4

## v0.5.5
- シーズンカレンダー最左列の日付列を削除
- 各月ヘッダーを `11月` / `12月` / `1月` ... のみに変更
- 画面上で日曜・祝日を赤、祝日でない土曜を青表示
- 2026/2027の祝日を内閣府公表日程に合わせて反映
- PDF印刷時は色を使わず、白背景・黒文字・罫線のみ
- SAJ大会一覧の大会名リンクを白文字固定、visited/hover/activeでも色変更なし
- 地域案内文を `大会出場するエリアにチェックを入れてください。` に変更
- ヘッダー v0.5.5

## v0.5.6
- PDF印刷時も曜日色を維持
- 日曜・祝日 = 赤文字
- 祝日ではない土曜 = 青文字
- 背景色は使用せず白背景
- 予定本文は黒文字
- 罫線 + 文字中心のA4横印刷仕様を維持
- ヘッダー v0.5.6

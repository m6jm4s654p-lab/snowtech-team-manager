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

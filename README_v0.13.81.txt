Alpine Team Manager v0.13.81

HOME年間カレンダー根本修正:
- v0.13.77〜0.13.80で独自実装していたHOMEカレンダー描画を廃止
- Alpine Team Supporter v1.1.8の縦スクロールカレンダー描画方式をManagerへ直接移植
- ManagerがSupporter更新ファイル作成時に使用している buildSupporterAnnualCalendar() を主データ源に使用
- 年間予定 / 大会管理データも補完して表示
- 5月〜翌4月の12か月縦スクロール
- 現在月が対象期間内なら現在月へ自動スクロール
- 表示領域に明示的な高さを付与し、ゼロ高さになる可能性を排除
- 表示切替は inline style + !important で直接制御
- 「直近1週間」「年間カレンダー」の選択状態を保存
- v0.13.78 LINE紹介、v0.13.76バックアップ修正を維持
- Cloudflare Worker再デプロイ不要

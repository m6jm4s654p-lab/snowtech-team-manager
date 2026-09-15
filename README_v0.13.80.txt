Alpine Team Manager v0.13.80

HOME年間カレンダー再修正:
- 表示/非表示を .hidden クラスや hidden 属性に依存せず style.display で直接制御
- チェック操作を onchange から onclick に変更
- カレンダー選択時は12か月分を必ず再描画
- localStorage が利用できない場合でも表示切替可能なメモリフォールバックを追加
- 大会の複数日程を各日へ展開して表示
- 描画失敗時は画面内にエラー表示
- 現在月がシーズン内なら現在月へ自動スクロール
- v0.13.78 LINE紹介、v0.13.76バックアップ修正を維持
- Cloudflare Worker再デプロイ不要

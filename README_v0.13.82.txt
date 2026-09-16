Alpine Team Manager v0.13.82

HOME年間カレンダー重複表示修正:
- HOME年間カレンダーの取得元を buildSupporterAnnualCalendar() の1系統に統一
- v0.13.81で行っていた db.schedules / db.events の二重補完を廃止
- 同一日・同一タイトル・同一会場の予定は source に関係なく1件だけ表示
- 年間予定と大会は buildSupporterAnnualCalendar() → buildSeasonBoardItems() 経由で引き続き表示
- v0.13.81の縦スクロールカレンダー表示方式を維持
- Cloudflare Worker再デプロイ不要

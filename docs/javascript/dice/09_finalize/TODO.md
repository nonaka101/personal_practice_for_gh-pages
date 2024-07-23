# Finalize ToDo

## 手順リスト

### 順序通りに行う作業

1. [ ] `index.html` の完成（英語化等はまだ）
   1. [x] ユニット名欄のスタイル（4dvw? rem使用？）
   2. [x] `dialog.bl_menuHeader` のスタイル（上部余白など）
   3. [x] ScoreTableにUpperSectionもしくは別途場所に表示を
   4. [x] Result画面（勝敗が即座にわかるよう、ヘッダー下に何かしら？）
   5. [ ] 用語統一（スコアとポイントとか、役名とか）
   6. [ ] ポイント変更（成立確率から）
   7. [ ] `dice` と `priority` から配列を返す関数 `calcScore()` を作る？
   8. [ ] スコアオブジェクト
      - `id`, `name`, `calcPoint` の３つ？
      - function `targetPoint()`, `totalPoint()`, `fixPoint()` 等を別途設け、`calcPoint` で指定？
      - 上記関数はダイス値を受け取り（fix は固定値も）、点数を計算させる？
      - `document.documentElement.lang // -> "en"` とわかるので、`name` は `ja`, `en` を用意？
   9. [ ] エネミーの最初らへんをテーブル使用に置き換える、assignmentは消去
   10. [ ] コンソールに出すのは選択されたものだけに？
2. 日本語版として完成できたか確認
3. `index-ja.html` にリネームし、英語版の `index.html` を生成、英語化
4. スクショを取りつつ、`how-to-play.md` の作成（ja/en）
5. `README.md` の作成（en/ja）

### 並行して行う作業

- [ ] CSS stylelint（Web-Zukuri側）
- [x] GH-Pages の webmanifest 確認（`start_url`）
  - [x] webmanifest の作成(en/ja)
- [x] LogoIcon の生成

## リリース前最終チェックリスト

- [ ] 各種ファイルの準備
  - [ ] index.html, index-ja.html
  - [x] manifest-en.webmanifest, manifest-ja.webmanifest
  - [x] .gitignore
  - [x] .nojekyll
  - [x] .editorconfig
  - [x] Squooshd された icons(32x32.ico, 150x150.svg, 180x180.png, 192x192.png, 512x512.png)
  - [x] LISENCE
  - [ ] README.md
  - [ ] how-to-play-en.md, how-to-play-ja.md
  - [ ] development.md(jaのみ？)
- [ ] index.html(en/ja) の内容確認（英語日本語それぞれで対応しているか含む）
  - [ ] webmanifest の連携
  - [ ] 各種リンク
  - [ ] `title`, `description` （※ `meta[robots]` は移行した際に変更）

## リリース後チェック

- `meta[robots]` の変更

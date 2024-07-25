# Finalize ToDo

## 手順リスト

### 順序通りに行う作業

1. [ ] `index.html` の完成（英語化等はまだ）
   1. [x] ユニット名欄のスタイル（4dvw? rem使用？）
   2. [x] `dialog.bl_menuHeader` のスタイル（上部余白など）
   3. [x] ScoreTableにUpperSectionもしくは別途場所に表示を
   4. [x] Result画面（勝敗が即座にわかるよう、ヘッダー下に何かしら？）
   5. [ ] 用語統一（スコアとポイントとか、役名とか）
   6. [x] ポイント変更（成立確率から）
   7. [x] [x] スコアオブジェクト
      - `id`, `name`, `calcPoint` の３つ？
      - `document.documentElement.lang // -> "en"` とわかるので、`name` は `ja`, `en` を用意？
   8. [x] エネミーの最初らへんをテーブル使用に置き換える、assignmentは消去
   9. [x] コンソールに出すのは選択されたものだけに？
2. 日本語版として完成できたか確認
3. `index-ja.html` にリネームし、英語版の `index.html` を生成、英語化
4. スクショを取りつつ、`how-to-play.md` の作成（ja/en）
5. `README.md` の作成（en/ja）

`SCORE.categories.Name.calcPoint` は、一旦取りやめ（点数計算するためにはダイス値をもらう必要があるが、そこまですると相互で繋がりが強くなりすぎるため）

「`dice` と `priority` から配列を返す関数 `calcScore()` を作る」のも、一旦除外

### 並行して行う作業

- [x] CSS stylelint
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

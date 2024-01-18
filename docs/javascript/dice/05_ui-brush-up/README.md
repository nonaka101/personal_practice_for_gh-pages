# `05_ui-brush-up`

ここでは、`04_assy-02-03` での内容を改善していきます。

## Short-Straight の判定修正

`11234` では `true` とされる一方、`12234` では `false` とされる判定ミスを修正しました。

この原因は L-straight と同じく `['1234', '2345', '3456']` の文字列パターンを用いて一致するかで判定していたためです。  
今回は `[[1,2,3,4],[2,3,4,5],[3,4,5,6]]` のパターン配列を用意し、ダイス配列との積集合（≒パターンが全て含まれているか）で判定しています。

## UI の改善

今後実装していく機能に備え、UIを変更しました。

- 縦長の画面
  - 下段は、ユーザーが操作するフィールド（固定）
    - 最下段は「役を選択する `select` 要素 ＋ 決定ボタン」
    - その上は「ダイスロールボタン」
    - その上は「５つのダイス（トグルによるロック機能）」
  - 中段は、役のリストを表示するフィールド（スクロール可）
  - 上段は、スコア関係を表示するフィールド（固定）
    - 左に「プレイヤーのスコア」
    - 右に「CPUのスコア」
    - 中央に「現在のターン数 / 全ターン数」
- 横長の画面

### ダイス面の表示

方法の１つとして、テキストではなく `svg` タグで画像として扱うことを考えた。

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
  <text x="50%" y="50%" font-size="32" style="dominant-baseline:central;text-anchor:middle;">
  ⚀
  </text>
</svg>
<style>svg {/* スタイル */}</style>
```

このメリットとしては、`font-size` を考慮する必要がなくなることである。これは「40*40(px) の枠で中央に 32(px) のテキストを入れた画像」というベースの上でサイズが拡縮するためである。

ただ検証してみたところ、必要とする内容（`line^height` 等の無駄な余白を無くしたい）にはあまり恩恵がなさそうである。`display: flex;` にして中央揃えするだけで同じような結果になったためである。

```html
<span>⚀</span>
<style>
  span {
  --size: 32px;
  display: flex;
  width: var(--size);
  height: var(--size);
  text-align: center;
  align-items: center;
  justify-content: center;
  font-size: var(--size);
  }
</style>
```

## `reset.css` の採用

[The New CSS Reset (MIT License)](https://elad2412.github.io/the-new-css-reset/)

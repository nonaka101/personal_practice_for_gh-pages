# FUNE

![FUNE logo](./notes/images/fune-logo-long-bgWhite.svg)

このリポジトリでは、ダイスゲーム「フネ」を管理しています。ゲーム自体は、Web上で遊ぶことができます。

This `README` is in Japanese, the English version is [here](./README.md).

## 遊び方

[リンク](./)（[英語版](./)）より、ブラウザ上で遊ぶことができます。ゲームの流れや役の説明については、下記を参照ください。

- [How to play this game (EN)](./notes/how-to-play-en.md)
- [遊び方 (JP)](./notes/how-to-play-ja.md)

## 特徴

### PWA

`webmanifest` を使っており、PWAとしてデバイス上にインストールすることができます。

### アクセシビリティ

様々なデバイスで遊べるように設計しています。

横画面時
![メイン画面](./notes/images/main-screen-01.png)

縦画面時
![上図に対して縦画面のレイアウト](./notes/images/main-screen-02.png)

また、フォントサイズやカラーモードなど、デバイス上の設定を使って適切なレイアウトになるようにしてます（これらは手動でも変更可能です）

そして更に、キーボード や スクリーンリーダーを使って操作できることを目指しています。

### 敵戦略の追加

現状 スコア配列を用意できれば、対戦相手の挙動を変更・追加することができます。詳しくは [for-developer-ja.md](./notes/for-developer-ja.md) を参照してください。

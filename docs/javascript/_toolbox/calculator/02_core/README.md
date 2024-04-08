# 設計メモ

## 総則

ここではコーディングの前段階となる、電卓としての機能等、全体的な定義を行う。
（電卓に搭載するボタンとその役割や、どのような設計で実現するか、など）

### ボタン一覧

### 設計方針

状態遷移の考えをベースとして、入力の整合性をチェックする。

#### ステート一覧

| 状態名 / 取りうる値 | 0 | 1-9 | . | - | +, *, / | = |
|----------------------|---|-----|---|---|---------------|---|
| Start                | OperandZero1 | OperandInteger1 | OperandDecimal1 | NegativeNum1 | - | - |
| NegativeNum1         | OperandZero1 | OperandInteger1 | OperandDecimal1 | - | - | - |
| OperandZero1         | - | OperandInteger1 | OperandDecimal1 | Operator | Operator | - |
| OperandInteger1      | OperandInteger1 | OperandInteger1 | OperandDecimal1 | Operator | Operator | - |
| OperandDecimal1      | OperandDecimal1 | OperandDecimal1 | OperandDecimal1 | Operator | Operator | - |
| Operator             | OperandZero2 | OperandInteger2 | OperandDecimal2 | NegativeNum2 | - | - |
| NegativeNum2         | OperandZero2 | OperandInteger2 | OperandDecimal2 | - | - | - |
| OperandZero2         | - | OperandInteger2 | OperandDecimal2 | Operator | Operator | Result |
| OperandInteger2      | OperandInteger2 | OperandInteger2 | OperandDecimal2 | Operator | Operator | Result |
| OperandDecimal2      | OperandDecimal2 | OperandDecimal2 | OperandDecimal2 | Operator | Operator | Result |
| Result               | OperandZero1 | OperandInteger1 | OperandDecimal1 | Operator | Operator | - |

下記は参考

|状態名/取りうる値|0|1-9|.|-|+, *, /|=|
|---|---|---|---|---|---|---|
|Start|OperandZero1|OperandInteger1|OperandDecimal1|NegativeNum1|-|-|
|NegativeNum1|OperandZero1|OperandInteger1|OperandDecimal1|-|-|-|
|OperandZero1|-|OperandInteger1|OperandDecimal1|-|Operator|Result|
|OperandInteger1|-|OperandInteger1|OperandDecimal1|-|Operator|Result|
|OperandDecimal1|-|-|OperandDecimal1|-|Operator|Result|
|Operator|OperandZero2|OperandInteger2|OperandDecimal2|NegativeNum2|-|Result|
|NegativeNum2|OperandZero2|OperandInteger2|OperandDecimal2|-|-|-|
|OperandZero2|-|OperandInteger2|OperandDecimal2|-|Operator|Result|
|OperandInteger2|-|OperandInteger2|OperandDecimal2|-|Operator|Result|
|OperandDecimal2|-|-|OperandDecimal2|-|Operator|Result|
|Result|OperandZero1|OperandInteger1|OperandDecimal1|NegativeNum1|Operator|-|

|状態名/取りうる値|'0'|'1'-'9'|'.'|'-'|'+', '*', '/'|'='|
|---|---|---|---|---|---|---|
|Start|OperandZero1|OperandInteger1|OperandDecimal1|NegativeNum1|-|-|
|NegativeNum1|OperandZero1|OperandInteger1|OperandDecimal1|-|-|-|
|OperandZero1|-|OperandInteger1|OperandDecimal1|-|Operator|Result|
|OperandInteger1|-|OperandInteger1|OperandDecimal1|-|Operator|Result|
|OperandDecimal1|-|OperandInteger1|-|-|Operator|Result|
|Operator|OperandZero2|OperandInteger1|-|NegativeNum2|-|-|
|NegativeNum2|OperandZero2|OperandInteger1|-|-|-|-|
|OperandZero2|-|OperandInteger1|-|-|-|Result|
|OperandInteger2|-|OperandInteger1|-|-|-|Result|
|OperandDecimal2|-|OperandInteger1|-|-|-|Result|
|Result|OperandZero1|OperandInteger1|OperandDecimal1|NegativeNum1|-|-|

#### コードへの落とし込み

## 実装

### 構成について

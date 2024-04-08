// 各種要素の取得
const btnCalculator = document.querySelector('#js_btn_calc');
const dialogCalculator = document.querySelector('#js_dialog_calculator');

// ボタン押下時、ダイアログをモーダル状態で表示
btnCalculator.addEventListener('click', () => {
	dialogCalculator.showModal();
});

// ダイアログを閉じる（ダイアログ内 buttonタグの `onClick` イベントに使用）
function closeDialogCalculator(){
	dialogCalculator.close();
};

// モーダルダイアログ外をクリック時、ダイアログを閉じる
dialogCalculator.addEventListener('click', (e) => {
	if(e.target === dialogCalculator){
		dialogCalculator.close();
	}
});



/* ≡≡≡ ▀▄ Calculator ▀▄ ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
	■ 概要
		電卓としての機能を持たせている。
		1. 状態遷移による入力管理
		2. コントロールからある程度独立したコア機能
---------------------------------------------------------------------------- */

/**
 * 数値のステージを enum 風に管理
 */
const CALC_STATE = Object.freeze({
	Start: 0,            // 初期状態
	NegativeNum1: 1,     // 左辺：マイナス符号を入力
	OperandZero1: 2,     // 左辺：ゼロ入力状態
	OperandInteger1: 3,  // 左辺：整数モード
	OperandDecimal1: 4,  // 左辺：少数モード
	Operator: 5,         // 演算子入力
	NegativeNum2: 6,     // 右辺：マイナス符号を入力
	OperandZero2: 7,     // 右辺：ゼロ入力状態
	OperandInteger2: 8,  // 右辺：整数モード
	OperandDecimal2: 9,  // 右辺：少数モード
	Result: 10,          // 計算結果
});

/**
 * Calculator が受け取れる文字列一覧
 */
const VALID_INPUTS = [
	"0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
	".", "+", "-", "*", "/", "="
];

/**
 * 各STATEに対応する、無効とされる入力集
 */
const INVALID_INPUTS_BY_STATE = Object.freeze({
	0:  ["+", "*", "/", "="],       // Start
	1:  ["+", "-", "*", "/", "="],  // NegativeNum1
	2:  ["0", "="],  // OperandZero1
	3:  ["="],       // OperandInteger1
	4:  [".", "="],  // OperandDecimal1
	5:  ["+", "*", "/", "="],       // Operator
	6:  ["+", "-", "*", "/", "="],  // NegativeNum2
	7:  ["0"],  // OperandZero2
	8:  [],     // OperandInteger2
	9:  ["."],  // OperandDecimal2
	10: ["="],     // Result
})

class Calculator {
  constructor() {
    this._expression = '';
		this._label = '';
		this._state = CALC_STATE.Start; // -> 0
  }

  push(input) {
		// 許容されているデータのみ処理に進める（入力としてありえるもの、かつ現ステートで無効な値）
    if ((!VALID_INPUTS.includes(input)) || (INVALID_INPUTS_BY_STATE[this._state].includes(input))) {
      return false;
    }
		switch (this._state){
			case CALC_STATE.Start:
				/* [    ] : 何も入力されていない状態
				 * ------------------------------------------------ 
				 *   0    : OperandZero1 に移行
				 *   -    : NegativeNum1 に移行
				 *   .    : "0" を先に追加し、OperandDecimal1 に移行
				 *  1-9   : OperandIntger1 に移行
				 */
				switch (input){
					case "0":
						this._expression += input;
						this._state = CALC_STATE.OperandZero1;
						break;
					case "-":
						this._expression += input;
						this._state = CALC_STATE.NegativeNum1;
						break;
					case ".":
						this._expression += "0";
						this._expression += input;
						this._state = CALC_STATE.OperandDecimal1;
						break;
					default: // -> case [1-9]
						this._expression += input;
						this._state = CALC_STATE.OperandInteger1; 
				}
				break;
			case CALC_STATE.NegativeNum1:
				/* [-   ] : 第一オペラントにマイナス入力
				 * ------------------------------------------------ 
				 *   0    : OperandZero1 に移行
				 *   .    : "0" を先に追加し、OperandDecimal1 に移行
				 *  1-9   : OperandIntger1 に移行
				 */
				switch (input){
					case "0":
						this._expression += input;
						this._state = CALC_STATE.OperandZero1;
						break;
					case ".":
						this._expression += "0";
						this._expression += input;
						this._state = CALC_STATE.OperandDecimal1;
						break;
					default: // -> case [1-9]
						this._expression += input;
						this._state = CALC_STATE.OperandInteger1; 
				}
				break;
			case CALC_STATE.OperandZero1:
				/* [0   ] : ゼロ入力モード
				 * -------------------------------------------------
				 *   .    : OperandDecimal1 に移行
				 * 演算子  : Operator に移行
				 *  1-9   : 式にある "0" を消し、OperandIntger1 に移行
				 */
				switch (input){
					case ".":
						this._expression += input;
						this._state = CALC_STATE.OperandDecimal1;
						break;
					case "+":
					case "-":
					case "*":
					case "/":
						this._expression += input;
						this._state = CALC_STATE.Operator;
						break;
					default: // -> case [1-9]
						this._expression = this._expression.slice(0, -1);
						this._expression += input;
						this._state = CALC_STATE.OperandInteger1; 
				}
				break;
			case CALC_STATE.OperandInteger1:
				/* [3   ] : 整数入力モード
				 * -------------------------------------------------
				 *   .    : OperandDecimal1 に移行
				 * 演算子  : Operator に移行
				 *  0-9   : 変化なし
				 */
				switch (input){
					case ".":
						this._expression += input;
						this._state = CALC_STATE.OperandDecimal1;
						break;
					case "+":
					case "-":
					case "*":
					case "/":
						this._expression += input;
						this._state = CALC_STATE.Operator;
						break;
					default: // -> case [0-9]
						this._expression += input;
				}
				break;
			case CALC_STATE.OperandDecimal1:
				/* [3.  ] : 少数入力モード
				 * -------------------------------------------------
				 * 演算子  : Operator に移行
				 *  0-9   : 変化なし
				 */
				switch (input){
					case "+":
					case "-":
					case "*":
					case "/":
						this._expression += input;
						this._state = CALC_STATE.Operator;
						break;
					default: // -> case [0-9]
						this._expression += input;
				}
				break;
			case CALC_STATE.Operator:
				/* [2+  ] : オペレータが入力された状態
				 * ------------------------------------------------ 
				 *   0    : OperandZero2 に移行
				 *   .    : "0" を先に追加し、OperandDecimal2 に移行
				 *   -    : NegativeNum2 に移行
				 * 演算子  :（マイナス以外は）式にある演算子を消す、ステート移行はなし
				 *  1-9   : OperandIntger2 に移行
				 */
				switch (input){
					case "0":
						this._expression += input;
						this._state = CALC_STATE.OperandZero2;
						break;
					case ".":
						this._expression += "0";
						this._expression += input;
						this._state = CALC_STATE.OperandDecimal2;
						break;
					case "-":
						this._expression += input;
						this._state = CALC_STATE.NegativeNum2;
						break;
					case "+":
					case "*":
					case "/":
						this._expression = this._expression.slice(0, -1);
						this._expression += input;
						break;
					default: // -> case [1-9]
						this._expression += input;
						this._state = CALC_STATE.OperandInteger2; 
				}
				break;
			case CALC_STATE.NegativeNum2:
				/* [2*- ] : 第二オペラントにマイナス入力
				 * ------------------------------------------------ 
				 *   0    : OperandZero2 に移行
				 *   .    : "0" を先に追加し、OperandDecimal2 に移行
				 *  1-9   : OperandIntger2 に移行
				 */
				switch (input){
					case "0":
						this._expression += input;
						this._state = CALC_STATE.OperandZero2;
						break;
					case ".":
						this._expression += "0";
						this._expression += input;
						this._state = CALC_STATE.OperandDecimal2;
						break;
					default: // -> case [1-9]
						this._expression += input;
						this._state = CALC_STATE.OperandInteger2; 
				}
				break;
			case CALC_STATE.OperandZero2:
				/* [2+0 ] : ゼロ入力モード
				 * -------------------------------------------------
				 *   .    : OperandDecimal2 に移行
				 *   =    : 計算処理し、Result に移行
				 * 演算子  : 計算処理し、演算子を引き継ぎ Operator に移行
				 *  1-9   : 式にある "0" を消し、OperandIntger2 に移行
				 */
				switch (input){
					case ".":
						this._expression += input;
						this._state = CALC_STATE.OperandDecimal2;
						break;
					case "=":
						this._label = this._expression;
						this._expression = this.calculate();
						this._state = CALC_STATE.Result; 
						break;
					case "+":
					case "-":
					case "*":
					case "/":
						this._label = this._expression;
						this._expression = this.calculate();
						this._expression += input;
						this._state = CALC_STATE.Operator;
						break;
					default: // -> case [1-9]
						this._expression = this._expression.slice(0, -1);
						this._expression += input;
						this._state = CALC_STATE.OperandInteger2; 
				}
				break;
			case CALC_STATE.OperandInteger2:
				/* [3+2 ] : 整数入力モード
				 * -------------------------------------------------
				 *   .    : OperandDecimal2 に移行
				 *   =    : 計算処理し、Result に移行
				 * 演算子  : 計算処理し、演算子を引き継ぎ Operator に移行
				 *  0-9   : 変化なし
				 */
				switch (input){
					case ".":
						this._expression += input;
						this._state = CALC_STATE.OperandDecimal2;
						break;
					case "=":
						this._label = this._expression;
						this._expression = this.calculate();
						this._state = CALC_STATE.Result; 
						break;
					case "+":
					case "-":
					case "*":
					case "/":
						this._label = this._expression;
						this._expression = this.calculate();
						this._expression += input;
						this._state = CALC_STATE.Operator;
						break;
					default: // -> case [0-9]
						this._expression += input;
				}
				break;
			case CALC_STATE.OperandDecimal2:
				/* [3+2.] : 少数入力モード
				 * -------------------------------------------------
				 *   =    : 計算処理し、Result に移行
				 * 演算子  : 計算処理し、演算子を引き継ぎ Operator に移行
				 *  0-9   : 変化なし
				 */
				switch (input){
					case "=":
						this._label = this._expression;
						this._expression = this.calculate();
						this._state = CALC_STATE.Result; 
						break;
					case "+":
					case "-":
					case "*":
					case "/":
						this._label = this._expression;
						this._expression = this.calculate();
						this._expression += input;
						this._state = CALC_STATE.Operator;
						break;
					default: // -> case [0-9]
						this._expression += input;
				}
				break;
			case CALC_STATE.Result:
				/* [5   ] : 計算結果の表示
				 * -------------------------------------------------
				 * 演算子  : Operator に移行
				 *   .    : 計算結果を消し、"0" を先に追加し、OperandDecimal1 に移行
				 *   0    : 計算結果を消し、OperandZero1 に移行
				 *  1-9   : 計算結果を消し、OperandIntger1 に移行
				 */
				switch (input){
					case "+":
					case "-":
					case "*":
					case "/":
						this._expression += input;
						this._state = CALC_STATE.Operator;
						break;
					case ".":
						this._label = '';
						this._expression = "0";
						this._expression += input;
						this._state = CALC_STATE.OperandDecimal1;
						break;
					case "0":
						this._label = '';
						this._expression = input;
						this._state = CALC_STATE.OperandZero1;
						break;
					default: // -> case [1-9]
						this._label = '';
						this._expression = input;
						this._state = CALC_STATE.OperandInteger1; 
				}
				break;
			default:
				console.log(`無効なステートが検出されました ${this._state}`);
		}
    return true;
  }

  calculate() {
    try {
      return eval(this._expression); // eslint-disable-line no-eval
    } catch (error) {
      this._label = `Error: ${error.message}`;
      return NaN;
    }
  }

	reset(){
		this._state = CALC_STATE.Start;
    this._expression = '';
		this._label = '';
	}
	get expression(){
		return this._expression;
	}
	get label(){
		return this._label
	}
}

const calculator = new Calculator();








const calcLabel = document.querySelector('#js_calc_label');
const calcOutput = document.querySelector('#js_calc_output');


// 計算ボタン郡（0〜9, 小数点, 四則演算子）
const calcBtn1 = document.querySelector('#js_calcBtn_1');
const calcBtn2 = document.querySelector('#js_calcBtn_2');
const calcBtn3 = document.querySelector('#js_calcBtn_3');
const calcBtn4 = document.querySelector('#js_calcBtn_4');
const calcBtn5 = document.querySelector('#js_calcBtn_5');
const calcBtn6 = document.querySelector('#js_calcBtn_6');
const calcBtn7 = document.querySelector('#js_calcBtn_7');
const calcBtn8 = document.querySelector('#js_calcBtn_8');
const calcBtn9 = document.querySelector('#js_calcBtn_9');
const calcBtn0 = document.querySelector('#js_calcBtn_0');
const calcBtnDecimalPoint = document.querySelector('#js_calcBtn_DecimalPoint');
const calcBtnAdd = document.querySelector('#js_calcBtn_Add');
const calcBtnSubtract = document.querySelector('#js_calcBtn_Subtract');
const calcBtnMultiply = document.querySelector('#js_calcBtn_Multiply');
const calcBtnDevide = document.querySelector('#js_calcBtn_Divide');
const calcBtnEqual = document.querySelector('#js_calcBtn_Equal');

const execArr = [ calcBtn1, calcBtn2, calcBtn3, calcBtn4, calcBtn5, calcBtn6, calcBtn7,
									calcBtn8, calcBtn9, calcBtn0, calcBtnDecimalPoint, calcBtnAdd,
									calcBtnSubtract, calcBtnMultiply, calcBtnDevide, calcBtnEqual,
								];
								
for (const ele of execArr){
	ele.addEventListener("click", (e) => {
		if(calculator.push(e.target.getAttribute('data-calc')) === true) {
			calcOutput.textContent = calculator.expression;
			calcLabel.textContent = calculator.label;
		} else {
			calcOutput.textContent = calculator.expression;
			calcLabel.textContent = '不正な入力です';
		}
	})
}

// 機能ボタン郡（クリア, バックスペース, コピー, 計算実行）
const calcBtnAllClear = document.querySelector('#js_calcBtn_AllClear');
calcBtnAllClear.addEventListener("click", () => {
	calculator.reset();
	calcOutput.textContent = calculator.expression;
	calcLabel.textContent = calculator.label;
})

const calcBtnBackSpace = document.querySelector('#js_calcBtn_BackSpace');
const calcBtnCopy = document.querySelector('#js_calcBtn_Copy');

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







class Calculator {
  constructor(output) {
		/* 左辺、演算子、右辺 を個別に管理 */
		this._bufferLeft = [];
		this._bufferRight = [];
		this._operator = '';

		/* ステージ管理による、許容される入力を変更 */
		this._stage = 0;
		/**
		 * "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "*", "/" 内で許容されるもの
		 * 
		 * 0: 初期状態（バッファ、演算子全て空の状態）
		 *    ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-"]
		 * 
		 * 1: 初期状態で 0 を選んだ場合
		 *    ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "*", "/"]
		 * 
		 * 2: 初期状態で +- を選んだ場合
		 *    ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
		 * 
		 * 3: 小数点を使った場合（そのバッファ内では２個目は使えない）
		 *    ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "*", "/"]
		 * 
		 * 4: 演算子を使った直後
		 *    ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
		 * */ 
		this._stageInvalidInputs = {
			0: [".", "*", "/"],
			1: ["0"],
			2: [".", "+", "-", "*", "/"],
			3: ["."],
			4: [".", "+", "-", "*", "/"],
		}

    this._expression = [];
		this.output = output;
  }

  push(input) {
    const validInputs = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "*", "/"];
		// 電卓にある（計算用）ボタンの値であり、かつ現在のステージで許容されているもののみを受け取る。
    if ((!validInputs.includes(input)) && (this._stageInvalidInputs[this._stage].includes(input))) {
      return false;
    }
		switch (this._stage){
			case 0:
				if(input === "0") this._stage = 1;
				if(['+', '-'].includes(input)) this._stage = 2
				this._bufferLeft.push(input);
				break;
			case 1:
				break;
			case 2:
				break;
			default:
			
		}
    this._expression += input;
		this.output.textContent = this._expression;
    return true;
  }

  calculate() {
    try {
      return eval(this.expression); // eslint-disable-line no-eval
    } catch (error) {
      console.error("計算エラー:", error.message);
      return NaN;
    }
  }

	reset(){
		this._bufferLeft = [];
		this._bufferRight = [];
		this._operator = '';
    this._expression = [];

		this.output.textContent = this._expression;
	}
}

const calcOutput = document.querySelector('#js_calc_output');
const calculator = new Calculator(calcOutput);








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

const execArr = [ calcBtn1, calcBtn2, calcBtn3, calcBtn4, calcBtn5, calcBtn6, calcBtn7,
									calcBtn8, calcBtn9, calcBtn0, calcBtnDecimalPoint, calcBtnAdd,
									calcBtnSubtract, calcBtnMultiply, calcBtnDevide,
								];
								
for (const ele of execArr){
	ele.addEventListener("click", (e) => {
		if(calculator.push(e.target.getAttribute('data-calc')) === true) {
			// 入力失敗時の処理
			console.log(`success: ${e.target.getAttribute('data-calc')}`);
		} else {
			console.log(`failure: ${e.target.getAttribute('data-calc')}`);
		}
	})
}

// 機能ボタン郡（クリア, バックスペース, コピー, 計算実行）
const calcBtnAllClear = document.querySelector('#js_calcBtn_AllClear');
calcBtnAllClear.addEventListener("click", () => {
	calculator.reset();
})

const calcBtnBackSpace = document.querySelector('#js_calcBtn_BackSpace');
const calcBtnCopy = document.querySelector('#js_calcBtn_Copy');
const calcBtnEqual = document.querySelector('#js_calcBtn_Equal');

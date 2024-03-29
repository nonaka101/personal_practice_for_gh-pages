/**
 * 5つのダイスから役を判定する。
 * @param {number} num - ソート済みダイス値 5桁
 * @returns {[string, number]} [`役名`, `ポイント`] を格納した二次元配列
 */
function calcScore (num) {
	/**
	 * 前処理
	 * 1. 各桁の数値を分解し、配列に変換する
	 * 2. 種類に関する計算ように、set型を用意
	 */
	numTxt = num.toString();

	let dices = [];
	for(let i = 0; i < numTxt.length; i++){
		dices.push(parseInt(numTxt[i]));
	}
	let uniqDices = new Set(dices);

	/**
	 * 役の判定
	 * 1. 全役の判定を管理する配列を用意
	 * 2. （chance 除く）各役の条件を満たすか判定し、フラグ立てしていく
	 * 		+ アッパー側は単純なループ処理
	 * 		+ ロウワー側は種類数に応じて処理を分岐
	 * 			- 種類数が 3 以下の場合は、kind系（+ yahtzee）、FullHouse
	 * 			- 種類数が 4 以上の場合は、straight系
	 */
	let categories = [
		true,		// 00:chance
		false,	// 01:aces
		false,	// 02:twos
		false,	// 03:threes
		false,	// 04:fours
		false,	// 05:fives
		false, 	// 06:sixes
		false,	// 07:full house
		false,	// 08:three of a kind
		false,	// 09:four of a kind
		false,	// 10:yahtzee
		false,	// 11:short straight
		false,	// 12:large straight
	];

	// Upper section
	uniqDices.forEach((n) => {
		categories[n] = true;
	})

	// Lower section
	if(uniqDices.size <= 3) {
		// Full House（2種類かつ `11222`,`11122` のように 2番目と4番目の数値が異なる）
		if( (uniqDices.size === 2) && (dices[1] !== dices[3]) ){
			categories[7] = true;
		}

		// N of a kind + yahtzee（隣り合う数値が同値である回数）
		let count = 0;
		let maxCount = 0;
		for(let i = 0; i < dices.length - 1; i++){
			if (dices[i] === dices[i+1]) {
				count++;
				if(count > maxCount){
					maxCount = count;
				}
			} else {
				count = 0;
			}
		}
		switch(maxCount){
			// 注：`break` なしは意図的、`maxCount=4` の場合 3,2 の内容も満たすため
			case 4:
				categories[10] = true;
			case 3:
				categories[9] = true;
			case 2:
				categories[8] = true;
		}
	} else {
		// (Short/Long) Straight
		let lStraightPattern = ['12345', '23456'];
		let sStraightPattern = ['1234', '2345', '3456'];
		lStraightPattern.forEach((s)=>{
			if(numTxt.includes(s)){
				categories[12] = true;
			}
		})
		sStraightPattern.forEach((s)=>{
			if(numTxt.includes(s)){
				categories[11] = true;
			}
		})
	}

	// この段階で、判定済みの `categories[]` が完成

	/**
	 * 点数計算
	 * + 全ダイスの合計値: chance, three of a kind, four of a kind
	 * + 特定のダイスの合計値: (全ての Upper section)
	 * + 25: Full House
	 * + 30: Short straight
	 * + 40: Large straight
	 * + 50: Yahtzee
	 */

	const scoreName = [
		'chance',						//  0
		'aces',							//  1
		'twos',							//  2
		'threes',						//  3
		'fours',						//  4
		'fives',						//  5
		'sixes',						//  6
		'full house',				//  7
		'three of a kind',	//  8
		'four of a kind',		//  9
		'yahtzee',					// 10
		'short straight',		// 11
		'large straight'		// 12
	];

	let resultArray = [];
	const allSum = [0, 8, 9];
	const targetSum = [1, 2, 3, 4, 5, 6];
	const fixedPoint = [[7, 25], [10, 50], [11, 30], [12, 40]];

	let total = 0;
	for(const d of dices){
		total += d;
	}

	allSum.forEach((i) => {
		if(categories[i]){
			resultArray.push([scoreName[i], total]);
		} else {
			resultArray.push([scoreName[i], 0]);
		}
	})

	targetSum.forEach((i) => {
		if(categories[i]){
			const filteredArray = dices.filter((item) => item !== i);
			const targetDices = dices.length - filteredArray.length;
			resultArray.push([scoreName[i], i * targetDices]);
		} else {
			resultArray.push([scoreName[i], 0]);
		}
	})

	for(let arr of fixedPoint){
		if(categories[arr[0]]){
			resultArray.push([scoreName[arr[0]], arr[1]]);
		} else {
			resultArray.push([scoreName[arr[0]], 0]);
		}
	}

	return resultArray;
}

// === Dice ===================================================================

const dieFace = ['🎲', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅',];

function toDieFace(num) {
	if([1, 2, 3, 4, 5, 6].includes(num)){
		return dieFace[num];
	} else {
		return dieFace[0];
	}
}

/**
 *
 */
class htmlCtrl {
	constructor(num, id){

		this.label = document.createElement('label');
		this.label.classList.add('bl_dice');

		this.input = document.createElement('input');
		this.input.type = 'checkbox';
		this.input.checked = false;
		this.input.name = 'dice' + num;
		this.input.classList.add('bl_dice_chkbox');

		this.span = document.createElement('span');
		this.span.classList.add('bl_dice_val');
		this.span.dataset.num = 1
		this.span.textContent = toDieFace(1);

		this.label.appendChild(this.input);
		this.label.appendChild(this.span);

		this.parent = document.getElementById(id);
		this.parent.appendChild(this.label);
	}
	get value(){
		let num = parseInt(this.span.dataset.num);
		let locked = this.input.checked;
		return [num, locked];
	}
	set value(states){
		const [num, locked] = states;
		this.span.dataset.num = num;
		this.span.textContent = toDieFace(num);
		this.input.checked = locked;
	}
}

class Dices {
	constructor(num){
		this.count = num;
		this.htmlCtrls = [];
		for(let i=1; i<= this.count; i++){
			this.htmlCtrls.push(new htmlCtrl(i, 'js_dice'));
		}
	}

	get values(){
		let states = [];
		for(let dice of this.htmlCtrls){
			states.push(dice.value);
		}
		return states;
	}

	set values(states){
		for(let i=0; i<= this.count -1; i++){
			this.htmlCtrls[i].value = states[i];
		}
	}

	roll(){
		const states = this.values;
		let newStates = [];
		for (let state of states){
			let [num, locked] = state;
			if(locked === false) {
				num = Math.floor(Math.random() * 6) + 1;
			}
			newStates.push([num, locked]);
		}

		// Sort
		newStates = newStates.sort(function(a,b){
			return(a[0] - b[0]);
		});

		this.values = newStates;
	}

}

let diceBox = new Dices(5);

const btnRoll = document.getElementById('btn-roll');
const result = document.getElementById('scores');
btnRoll.addEventListener('click',() => {
	diceBox.roll();

	// 前の結果の消去
	while (result.firstChild) {
		result.removeChild(result.firstChild);
	}

	// 計算結果の取得
	let diceStates = diceBox.values;
	let num = '';
	for(let diceState of diceStates){
		num += diceState[0].toString();
	}
	num = parseInt(num);
	let score = calcScore(num);
	score = score.sort(function(a,b){
		return(b[1] - a[1]);
	});

	// 結果を反映
	for(let item of score){
		let ele = document.createElement('li');
		ele.textContent = item;
		result.appendChild(ele);
	}
});

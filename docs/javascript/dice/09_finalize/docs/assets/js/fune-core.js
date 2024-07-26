/** ボーナスに必要となるアッパーセクション合計値 */
const NEED_UPPER_BONUS = 63;

/**
 * 言語指定（デフォルト：en）
 * @constant {string}
 */
const docLang = document.documentElement.lang || 'en';

const SCORE = Object.freeze({
	categories: Object.freeze({
		Ones: Object.freeze({
			id: 0,
			name: Object.freeze({
				ja: '1の目',
				en: 'Ones',
			}),
		}),
		Twos: Object.freeze({
			id: 1,
			name: Object.freeze({
				ja: '2の目',
				en: 'Twos',
			}),
		}),
		Threes: Object.freeze({
			id: 2,
			name: Object.freeze({
				ja: '3の目',
				en: 'Threes',
			}),
		}),
		Fours: Object.freeze({
			id: 3,
			name: Object.freeze({
				ja: '4の目',
				en: 'Fours',
			}),
		}),
		Fives: Object.freeze({
			id: 4,
			name: Object.freeze({
				ja: '5の目',
				en: 'Fives',
			}),
		}),
		Sixes: Object.freeze({
			id: 5,
			name: Object.freeze({
				ja: '6の目',
				en: 'Sixes',
			}),
		}),
		FullHouse: Object.freeze({
			id: 6,
			name: Object.freeze({
				ja: 'フルハウス',
				en: 'Full House',
			}),
		}),
		FourDice: Object.freeze({
			id: 7,
			name: Object.freeze({
				ja: 'フォーダイス',
				en: 'Four Dice',
			}),
		}),
		ThreeDice: Object.freeze({
			id: 8,
			name: Object.freeze({
				ja: 'スリーダイス',
				en: 'Three Dice',
			}),
		}),
		ShortStraight: Object.freeze({
			id: 9,
			name: Object.freeze({
				ja: 'ショートストレート',
				en: 'Short Straight',
			}),
		}),
		LongStraight: Object.freeze({
			id: 10,
			name: Object.freeze({
				ja: 'ロングストレート',
				en: 'Long Straight',
			}),
		}),
		Fune: Object.freeze({
			id: 11,
			name: Object.freeze({
				ja: 'フネ',
				en: 'FUNE',
			}),
		}),
		Choice: Object.freeze({
			id: 12,
			name: Object.freeze({
				ja: 'チョイス',
				en: 'Choice',
			}),
		}),
		UpperBonus: Object.freeze({
			id: 13,
			name: Object.freeze({
				ja: 'ボーナス',
				en: 'Bonus',
			}),
		}),
	}),

	getNameByID: function(id){
		let entries = Object.values(this.categories);
		for(const entry of entries){
			if(entry.id === id){
				return entry.name[docLang];
			}
		}
		// 見つからない場合
		return 'unknown';
	},

	getNames: function(){
		let entries = Object.values(this.categories);
		let arr = [];
		for(const entry of entries){
			arr.push(entry.name[docLang]);
		}
		return arr;
	},

	getIDs: function(){
		let entries = Object.values(this.categories);
		let arr = [];
		for(const entry of entries){
			arr.push(parseInt(entry.id));
		}
		return arr.sort((a,b)=>{
			return a - b;
		});
	}
});

let scoreNames = SCORE.getNames();




/**
 * 配列にNull値があるかを判定する。
 *
 * @param {[number]} arr - 配列
 * @returns {boolean} Null値が含まれる場合は true
 */
function hasNull(arr){
	return arr.flat(Infinity).some((item)=> item === null);
}

/**
 * 2つの配列をZipする
 *
 * @param {[any]} arr1 - 配列A
 * @param {[any]} arr2 - 配列B
 * @returns {[any]} 配列 `[[配列A[0], 配列B[0]], [配列A[1], 配列B[1]] ...]`（両者のサイズが違う場合は小さい方に合わせる）
 */
function zip(arr1, arr2) {
	let length = Math.min(arr1.length, arr2.length);
	let result = [];

	for (let i = 0; i < length; i++) {
			result.push([arr1[i], arr2[i]]);
	}

	return result;
}



/**
 * 5つのダイスから役を判定する。
 *
 * @param {number} num - 5桁のダイス値
 * @returns {[number]} SCORE.categories.{Name}.id のインデックスに沿った、役のスコア値
 */
function calcCombinations(num){
	// 入力値の検証（数値としての、5桁のダイス値）
  const regex = /^[1-6]{5}$/;
  if(!regex.test(String(num))) throw new Error('Argument must be a 5-digit dice value.');

	// ソートした配列とセットに変換
  const dices = String(num).split('').map(Number).sort();
	const uniqDices = new Set(dices);

	// ダイスの合計値（スコア計算用）
	const totalDices = dices.reduce((a, b) => a + b, 0);

	// 13役を格納する配列（UpperBonusを除く）
	const combinations = new Array(13).fill(0);

	/* Upper Section（Ones から Sixes まで）
		得点：ダイス値✕該当するダイス数  */
	for(let i = SCORE.categories.Ones.id, d = 1; i <= SCORE.categories.Sixes.id; i++, d++){
		const filtered = dices.filter((item) => item === d);
		combinations[i] = d * filtered.length;
	}

	// Lower Section
	// Choice（得点：ダイス合計値）
	combinations[SCORE.categories.Choice.id] = totalDices;

	/* ダイス種類による処理の分岐
		4より少なければFullHouse、N-Dice、FUNE が該当
		4以上なら (Short or Long) Straight が該当 */
	if(uniqDices.size < 4){
		/* FullHouse
			判定：2種類かつ `11222`,`11122` のように 2番目と4番目の数値が異なる
			得点：固定値 35  */
		if((uniqDices.size === 2) && (dices[1] !== dices[3])) combinations[SCORE.categories.FullHouse.id] = 35;

		/* N-Dice + Fune
			判定：隣り合う数値が同値である最大回数（4回なら FUNE、3回なら FourDice）
			得点：FUNE は固定値 50、N-Dice はダイス合計値  */
		let count = 0;
		let maxCount = 0;
		for(let i = 0; i < dices.length - 1; i++){
			if (dices[i] === dices[i + 1]) {
				count++;
				if(count > maxCount) maxCount = count;
			} else {
				count = 0;
			}
		}
		switch(maxCount){
			// 注：`break` なしは意図的（FUNE は N-Dice の十分条件）
			case 4:
				combinations[SCORE.categories.Fune.id] = 50;
			case 3:
				combinations[SCORE.categories.FourDice.id] = totalDices;
			case 2:
				combinations[SCORE.categories.ThreeDice.id] = totalDices;
		}
	} else {
		/* (Short / Long) Straight
			判定：判定に必要なパターンを満たすか（ロングはショートの十分条件であることも利用）
			得点：固定値（ショートは 30、ロングは 40）  */
		const patternLongStraight = [[1, 2, 3, 4, 5], [2, 3, 4, 5, 6]];
		for(const pattern of patternLongStraight){
			if(pattern.every(ele => dices.includes(ele))){
				combinations[SCORE.categories.LongStraight.id] = 40;
				combinations[SCORE.categories.ShortStraight.id] = 30;
				break;
			};
		}
		// ロング条件を満たしてない場合、ショート判定を行う
		if(combinations[SCORE.categories.ShortStraight.id] !== 30){
			const patternShortStraight = [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6]];
			for(const pattern of patternShortStraight){
				if(pattern.every(ele => dices.includes(ele))){
					combinations[SCORE.categories.ShortStraight.id] = 30;
					break;
				};
			}
		}
	}
	return combinations;
}

class PlayerUnit{
	constructor(name, isPlayer = false){
		this._name = name;
		this._score = new Array(14).fill(null);
		this._isPlayer = isPlayer;
	}

	get name(){
		return this._name;
	}

	get score(){
		return this._score;
	}

	get upperScore(){
		// score前方にあるアッパーセクション部の合計値を算出
		return this._score.slice(SCORE.categories.Ones.id, SCORE.categories.Sixes.id + 1).reduce((a, b) => a + b, 0);;
	}

	get totalScore(){
		// Null値を除いたスコア合計を算出
		return this._score.reduce((a, b) => a + b, 0);
	}

	setScore(index, point){
		if(
			(index >= SCORE.categories.Ones.id && index <= SCORE.categories.Choice.id) &&
			(this._score[index] === null)
		){
			this._score[index] = point;

			// UpperBonus 判定（確定前 かつ アッパーセクションに Null値なし）
			if(
				(this._score[SCORE.categories.UpperBonus.id] === null) &&
				(! hasNull(this._score.slice(SCORE.categories.Ones.id, SCORE.categories.Sixes.id + 1)))
			){
				// Ones から Sixes までの合計値が 63以上の場合は35点、そうでなければ 0点
				if(this.upperScore >= NEED_UPPER_BONUS){
					this._score[SCORE.categories.UpperBonus.id] = 35;
				} else {
					this._score[SCORE.categories.UpperBonus.id] = 0;
				}
			}
		} else {
			throw new Error('setScore error : Index is out of score, or score has already been determined.');
		}
		this.reportScoreTable();
		document.dispatchEvent(new CustomEvent("handover", {
			detail: {isPlayer: this._isPlayer}
		}));
	}

	reportScoreTable(){
		let table = zip(SCORE.getNames(), this._score);
		console.table(table);
	}
}

class Player extends PlayerUnit{
	constructor(name){
		super(name, true);
	}
}

class Enemy extends PlayerUnit{
	constructor(name, dummyDatas){
		super(name, false);
		this._datas = dummyDatas;
	}
	setDummyData(){
		let [index, point] = this._datas.shift();
		super.setScore(index, point);
	}
}

class GameMaster {
	constructor(player, enemy){
		this._player = player;
		this._enemy = enemy;
		this._winner = undefined;
	}
	get winner(){
		return this._winner;
	}
	update(){
		if(
			(!hasNull(this._player.score)) &&
			(!hasNull(this._enemy.score))
		){
			this.result();
		}
	}
	result(){
		let result = this._player.totalScore - this._enemy.totalScore;
		console.log(`${this._player.name}'s Score is ${this._player.totalScore}`)
		console.log(`${this._enemy.name}'s Score is${this._enemy.totalScore}`)
		switch (true) {
			case (result > 0):
				console.log(`${this._player.name} is winner.`);
				this._winner = this._player.name;
				break;
			case (result < 0):
				console.log(`${this._enemy.name} is winner.`);
				this._winner = this._enemy.name;
				break;
			case (result === 0):
				console.log("This game is a draw.");
				this._winner = 'Draw';
				break;
		}
	}
}

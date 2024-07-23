/** ボーナスに必要となるアッパーセクション合計値 */
const NEED_UPPER_BONUS = 63;

const SCORE_CATEGORIES = Object.freeze({
	Aces: 0,
	Twos: 1,
	Threes: 2,
	Fours: 3,
	Fives: 4,
	Sixes: 5,
	Full_house: 6,
	Four_of_a_kind: 7,
	Three_of_a_kind: 8,
	Short_straight: 9,
	Long_straight: 10,
	Yahzee: 11,
	Chance: 12,
	Upper_bonus: 13,	// （Aces-Sixes の合計値が63以上の場合、35点）
})

const SCORE_NAMES = Object.freeze({
	0: '1の目',
	1: '2の目',
	2: '3の目',
	3: '4の目',
	4: '5の目',
	5: '6の目',
	6: 'フルハウス',
	7: 'フォー オブ アカインド',
	8: 'スリー オブ アカインド',
	9: 'ショート ストレート',
	10: 'ロング ストレート',
	11: 'ヤッツィー',
	12: 'チャンス',
	13: 'アッパーボーナス',
});

// TODO: 両者をまとめたこちらに移行させる（注意：役名が異なる）
const SCORE = Object.freeze({
	categories: {
		Ones: {
			id: 0,
			name: {
				ja: '1の目',
				en: 'Ones',
			},
		},
		Twos: {
			id: 1,
			name: {
				ja: '2の目',
				en: 'Twos',
			},
		},
		Threes: {
			id: 2,
			name: {
				ja: '3の目',
				en: 'Threes',
			},
		},
		Fours: {
			id: 3,
			name: {
				ja: '4の目',
				en: 'Fours',
			},
		},
		Fives: {
			id: 4,
			name: {
				ja: '5の目',
				en: 'Fives',
			},
		},
		Sixes: {
			id: 5,
			name: {
				ja: '6の目',
				en: 'Sixes',
			},
		},
		FullHouse: {
			id: 6,
			name: {
				ja: 'フルハウス',
				en: 'Full House',
			},
		},
		FourDice: {
			id: 7,
			name: {
				ja: 'フォーダイス',
				en: 'Four Dice',
			},
		},
		ThreeDice: {
			id: 8,
			name: {
				ja: 'スリーダイス',
				en: 'Three Dice',
			},
		},
		ShortStraight: {
			id: 9,
			name: {
				ja: 'ショートストレート',
				en: 'Short Straight',
			},
		},
		LongStraight: {
			id: 10,
			name: {
				ja: 'ロングストレート',
				en: 'Long Straight',
			},
		},
		Fune: {
			id: 11,
			name: {
				ja: 'フネ',
				en: 'FUNE',
			},
		},
		Choice: {
			id: 12,
			name: {
				ja: 'チョイス',
				en: 'Choice',
			},
		},
		UpperBonus: {
			// （Aces-Sixes の合計値が63以上の場合、35点）
			id: 13,
			name: {
				ja: 'ボーナス',
				en: 'Bonus',
			},
		},
	},

	getNameByID: function(id, lang = 'en'){
		let entries = Object.values(this.categories);
		for(const entry of entries){
			if(entry.id === id){
				return entry.name[lang];
			}
		}
		// 見つからない場合
		return 'unknown';
	},

	getNames: function(lang = 'en'){
		let entries = Object.values(this.categories);
		let arr = [];
		for(const entry of entries){
			arr.push(entry.name[lang]);
		}
		return arr;
	},

	getIDs: function(){
		let entries = Object.values(this.categories);
		let arr = [];
		for(const entry of entries){
			arr.push(entry.id);
		}
		return arr.sort();
	}
});


// 言語指定（デフォ：en）
const docLang = document.documentElement.lang || 'en';



// 関数を定義して翻訳を実行
function translateScore(symbol) {
	return SCORE_NAMES[symbol] || 'unknown';  // 未定義のシンボルには 'unknown' を返す
}

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
 * @returns {[number]} SCORE_CATEGORIES のインデックスに沿った、役のスコア値
 */
function calcCombinations(num){
	// 入力値の検証（数値としての、5桁のダイス値）
  const regex = /^[1-6]{5}$/;
  if(!regex.test(String(num))) throw new Error('引数は5桁のダイス値でなければなりません');

	// ソートした配列とセットに変換
  const dices = String(num).split('').map(Number).sort();
	const uniqDices = new Set(dices);

	// ダイスの合計値（スコア計算用）
	const totalDices = dices.reduce((a, b) => a + b, 0);

	// 13役を格納する配列（UpperBonusを除く）
	const combinations = new Array(13).fill(0);

	/* Upper Section（Aces から Sixes まで）
		得点：ダイス値✕該当するダイス数  */
	for(let i = SCORE_CATEGORIES.Aces, d = 1; i <= SCORE_CATEGORIES.Sixes; i++, d++){
		const filtered = dices.filter((item) => item === d);
		combinations[i] = d * filtered.length;
	}

	// Lower Section
	// Chance（得点：ダイス合計値）
	combinations[SCORE_CATEGORIES.Chance] = totalDices;

	/* ダイス種類による処理の分岐
		4より少なければフルハウス、Nオブアカインド、ヤッツィーが該当
		4以上なら（ショート/ロング）ストレートが該当 */
	if(uniqDices.size < 4){
		/* FullHouse
			判定：2種類かつ `11222`,`11122` のように 2番目と4番目の数値が異なる
			得点：固定値 25  */
		if((uniqDices.size === 2) && (dices[1] !== dices[3])) combinations[SCORE_CATEGORIES.Full_house] = 25;

		/* N of a kind + Yahzee
			判定：隣り合う数値が同値である最大回数（4回ならYahtzee、3回なら Four of a kind）
			得点：Yahtzee は固定値 50、Nオブアカインドはダイス合計値  */
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
			// 注：`break` なしは意図的（Yahtzee は Nオブアカインドの十分条件）
			case 4:
				combinations[SCORE_CATEGORIES.Yahzee] = 50;
			case 3:
				combinations[SCORE_CATEGORIES.Four_of_a_kind] = totalDices;
			case 2:
				combinations[SCORE_CATEGORIES.Three_of_a_kind] = totalDices;
		}
	} else {
		/* (Short / Long) Straight
			判定：判定に必要なパターンを満たすか（ロングはショートの十分条件であることも利用）
			得点：固定値（ショートは 30、ロングは 40）  */
		const patternLongStraight = [[1, 2, 3, 4, 5], [2, 3, 4, 5, 6]];
		for(const pattern of patternLongStraight){
			if(pattern.every(ele => dices.includes(ele))){
				combinations[SCORE_CATEGORIES.Long_straight] = 40;
				combinations[SCORE_CATEGORIES.Short_straight] = 30;
				break;
			};
		}
		// ロング条件を満たしてない場合、ショート判定を行う
		if(combinations[SCORE_CATEGORIES.Short_straight] !== 30){
			const patternShortStraight = [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6]];
			for(const pattern of patternShortStraight){
				if(pattern.every(ele => dices.includes(ele))){
					combinations[SCORE_CATEGORIES.Short_straight] = 30;
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
		return this._score.slice(SCORE_CATEGORIES.Aces, SCORE_CATEGORIES.Sixes + 1).reduce((a, b) => a + b, 0);;
	}

	get totalScore(){
		// Null値を除いたスコア合計を算出
		return this._score.reduce((a, b) => a + b, 0);
	}

	setScore(index, point){
		if(
			(index >= SCORE_CATEGORIES.Aces && index <= SCORE_CATEGORIES.Chance) &&
			(this._score[index] === null)
		){
			this._score[index] = point;

			// UpperBonus 判定（確定前 かつ アッパーセクションに Null値なし）
			if(
				(this._score[SCORE_CATEGORIES.Upper_bonus] === null) &&
				(! hasNull(this._score.slice(SCORE_CATEGORIES.Aces, SCORE_CATEGORIES.Sixes + 1)))
			){
				// Aces から Sixes までの合計値が 63以上の場合は35点、そうでなければ 0点
				if(this.upperScore >= NEED_UPPER_BONUS){
					this._score[SCORE_CATEGORIES.Upper_bonus] = 35;
				} else {
					this._score[SCORE_CATEGORIES.Upper_bonus] = 0;
				}
			}
		} else {
			throw new Error('setScoreエラー：indexがスコア外、もしくはスコアが決定済みの可能性');
		}
		this.reportScoreTable();
		document.dispatchEvent(new CustomEvent("handover", {
			detail: {isPlayer: this._isPlayer}
		}));
	}

	reportScoreTable(){
		let table = zip(Object.values(SCORE_NAMES), this._score);
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
		console.log(`${this._player.name} の得点は ${this._player.totalScore}`)
		console.log(`${this._enemy.name} の得点は ${this._enemy.totalScore}`)
		switch (true) {
			case (result > 0):
				console.log(`${this._player.name} の勝利です`);
				this._winner = this._player.name;
				break;
			case (result < 0):
				console.log(`${this._enemy.name} の勝利です`);
				this._winner = this._enemy.name;
				break;
			case (result === 0):
				console.log("引き分けです");
				this._winner = 'Draw';
				break;
		}
	}
}

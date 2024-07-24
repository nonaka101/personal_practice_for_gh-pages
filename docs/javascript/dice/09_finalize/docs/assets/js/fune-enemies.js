// URLからのクエリ処理
let url = new URL(document.location);
let urlParams = url.searchParams;
const enemyID = parseInt(urlParams.get('enemy_id')) || 0;

/** 敵ユニット名 */
const enemyList = [
	'_00:TestDummy',
	'A01:Basic',
	'A02:Priority+A01',
	'A03:Bonus+A02'
];

const selEnemy = document.querySelector('#js_decision_strategy');
selEnemy.innerHTML = '';
for (let i = 0; i < enemyList.length; i++){
	const opt = document.createElement('option');
	opt.value = i;
	opt.text = enemyList[i];
	if (enemyID === i) opt.selected = true;
	selEnemy.add(opt, selEnemy.options.item(i));
}

// クエリ付きでリロードする関数（敵ユニットの変更や、ゲーム終了時に使用）
function reloadWithQuery(){
	urlParams.set('enemy_id', selEnemy.value);
	window.location.href = url.href;
}



/**
 * 外側の次元要素をランダムな順番にする
 *
 * @param {[any]} arr - 1次以上の配列
 * @returns {[any]} 最も外にある次元要素がランダムな順番になった配列
 */
function randomizeArray(arr) {
  if (arr.length === 0) return arr;

  // ランダムなインデックスを生成
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}



/**
 * 配列の次元数を返す
 *
 * @param {[any]} array - 調べたい配列
 * @returns {number} 次元数
 */
function getDimension(array) {
	if (!Array.isArray(array)) {
			return 0;
	}
	let dimension = 1;
	let element = array[0];
	while (Array.isArray(element)) {
			dimension++;
			element = element[0];
	}
	return dimension;
}















/**
 * 行列テーブル
 * @class
 */
class Table {
	/**
	 * Tableのインスタンス生成
	 * @param {[number]} array - 行列となる2次元配列
	 */
	constructor(array){
		// テーブル化の事前検証（2次元配列で、各行で列数が同じ）
		if(getDimension(array) !== 2) throw new Error('2次元配列でないため Table 作成不可');
		const colSize = array[0].length;
		for(let i = 1; i < array.length; i++){
			if(array[i].length !== colSize) throw new Error('列数が統一されていないため Table 作成不可');
		}

		/** @private */
		this._table = array;
	}

	/** @returns {number} 行数 */
	get rows(){
		return this._table.length;
	}

	/** @returns {number} 列数 */
	get columns(){
		return this._table[0].length;
	}

	/** @returns {number} セル数 */
	get cells(){
		return this._table.length * this._table[0].length;
	}

	/**
	 * 指定した行を取得
	 * @param {number} rowIndex - 行インデックス
	 * @returns {[number]} 該当する行
	 */
	getRow(rowIndex){
		return this._table[rowIndex];
	}

	/**
	 * 行を置換
	 * @param {number} rowIndex - 置換する行インデックス
	 * @param {[number]} newRow - 置換先
	 */
	replaceRow(rowIndex, newRow){
		if(this.columns !== newRow.length) throw new Error('サイズ違いにより置換不能');
		this._table[rowIndex] = newRow;
	}

	/**
	 * 行を追加
	 * @param {[number]} newRow - 新規追加分
	 */
	addRow(newRow){
		if(this.columns !== newRow.length) throw new Error('サイズ違いにより置換不能');
		this._table.push(newRow);
	}

	/**
	 * 行を削除
	 * @param {number} rowIndex - 削除する行インデックス
	 */
	removeRow(rowIndex){
		this._table.splice(rowIndex, 1);
	}

	/**
	 * 指定した列を取得
	 * @param {number} colIndex - 列インデックス
	 * @returns {[number]} 該当する列
	 */
	getColumn(colIndex){
		return this._table.map(row => row[colIndex]);
	}

	/**
	 * 列を置換
	 * @param {number} colIndex - 置換する列インデックス
	 * @param {[number]} newCol - 置換先
	 */
	replaceColumn(colIndex, newCol){
		if(this.rows !== newCol.length) throw new Error('サイズ違いにより置換不能');
		for (let i = 0; i < this.rows; i++) {
			this._table[i][colIndex] = newCol[i];
		}
	}

	/**
	 * 列を追加
	 * @param {[number]} newCol - 新規追加分
	 */
	addColumn(newCol){
		if(this.rows !== newCol.length) throw new Error('サイズ違いにより置換不能');
		for (let i = 0; i < this.rows; i++) {
			this._table[i].push(newCol[i]);
		}
	}

	/**
	 * 列を削除
	 * @param {number} colIndex - 削除する列インデックス
	 */
	removeCol(colIndex){
		for (let i = 0; i < this.rows; i++) {
			this._table[i].splice(colIndex, 1);
		}
	}
}




















/** 敵側のダイスセット */
let enemyDiceSet = [];
for(let i = 0; i < 13; i++){
  let dices = '';
  for(let j = 0; j < 5; j++){
    dices += String(Math.floor(Math.random() * 6) + 1);
  }
	dices = dices.split('').map(Number).sort().toString().replace(/,/gui,'');
  enemyDiceSet.push(dices);
}
console.log('--- 敵側のダイスセット ---');
console.table(enemyDiceSet);

// 役一覧（13 に該当するボーナスを除いた形）
let categories = SCORE.getIDs().slice(0, -1);

let emptyScore = [];
for (let i = 0; i <= 12; i++) {
	emptyScore.push([i, 0]);
}




















/** [A01] 敵戦略１：役順に高得点を当てはめていく
 *
 *  特徴：役順に未割り当てのダイスを当てはめ、高得点になるものを割り当てる
 *
 *  課題：後方にある役の方が最善手でも前方の役に割り当てることがある
 * （例：11222 でも、場合によってはフルハウスでもスリーダイスでも、まして 2の目でもなく 1の目に割り当てられる）
 */
let enemyA01Assignment = {};
console.log('--- 敵戦略１：役順に高得点を当てはめていく ---');

// 各種配列のディープコピーを用意
let enemyA01Score = JSON.parse(JSON.stringify(emptyScore));
let enemyA01DiceSetCopy = JSON.parse(JSON.stringify(enemyDiceSet));

// 各役について、最適なダイス値を見つける
for (const category of categories) {
  // 未割り当てのダイスセット
  const unassignedenemyDiceSet = [...enemyA01DiceSetCopy];

  // 現在の役の最高得点
  let maxScore = 0;

  // 現在の役に対応する最適なダイス値（コンソール用）
  let bestDice = '';

  // 未割り当てのダイスセットをすべて試す
  for (const dices of unassignedenemyDiceSet) {
    // 現在のダイス値で役のスコアを計算
    const score = calcCombinations(dices)[category];

    // 現在の役の最高得点を超えていれば更新
    if (score >= maxScore) {
      maxScore = score;
      bestDice = dices;
			enemyA01Score[category][1] = score;
    }
  }

  // 役と最適なダイス値を割り当て
  enemyA01Assignment[scoreNames[category]] = [bestDice, maxScore];

  // 使用済みダイスセットから削除（同じダイス値があるケースを想定、1つのみに限定をかける）
	const removeIndex = enemyA01DiceSetCopy.indexOf(bestDice);
	if(removeIndex !== -1) enemyA01DiceSetCopy.splice(removeIndex, 1);
}

// 割り当て結果を表示
const enemyA01ScoreUpperSection = enemyA01Score.slice(0, 5 + 1).reduce((total, value) => total + value[1], 0);
let enemyA01Bonus = 0;
if(enemyA01ScoreUpperSection >= NEED_UPPER_BONUS) enemyA01Bonus = 35;
enemyA01Assignment['UpperBonus'] = ['---', enemyA01Bonus];
console.table(enemyA01Assignment);
console.log(`スコア合計値：${enemyA01Score.reduce((total, value) => total + value[1], 0) + enemyA01Bonus}`);




















/** [A02] 敵戦略２：A01に優先度を付与
 *
 *  特徴：役の成立可能性が低い順にダイスを当てはめていくことで、A01より得点力を上げる
 *  （ダイスパターン 252 に対し、L-Straight: 2, Fune: 6, S-Straight: 10, FullHouse: 30, FourDice: 36, ThreeDice: 126 の組み合わせが存在）
 *
 *  課題：「役の0点を無くすこと」と「高得点を狙うこと」は微妙に違う。例えばこの方針だと、ボーナスは得にくいかもしれない。
 *        必ずA01より高得点になるとは限らない。例えば L-Straight がダイスセット内で成立しなかった場合、ダイスセットの一番最後が捨てられることになるが、それが Fune の可能性がある。
 */
let enemyA02Assignment = {};
console.log('--- 敵戦略２：A01に優先度を付与 ---');
let enemyA02Score = JSON.parse(JSON.stringify(emptyScore));

/** 役の成立が難しい順に優先度を設定 */
const priorityA02 = [
	SCORE.categories.Fune.id,
	SCORE.categories.FourDice.id,
	SCORE.categories.LongStraight.id,
	SCORE.categories.FullHouse.id,
	SCORE.categories.ShortStraight.id,
	SCORE.categories.ThreeDice.id,
	SCORE.categories.Sixes.id,
	SCORE.categories.Fives.id,
	SCORE.categories.Fours.id,
	SCORE.categories.Threes.id,
	SCORE.categories.Twos.id,
	SCORE.categories.Ones.id,
	SCORE.categories.Choice.id
];

// enemyDiceSet 要素を弄るため ディープコピーを用意
let enemyA02DiceSetCopy = JSON.parse(JSON.stringify(enemyDiceSet));

for (const category of priorityA02) {
  const unassignedenemyDiceSet = [...enemyA02DiceSetCopy];
  let maxScore = 0;
  let bestDice = '';

  for (const dices of unassignedenemyDiceSet) {
    const score = calcCombinations(dices)[category];
    if (score >= maxScore) {
      maxScore = score;
      bestDice = dices;
			enemyA02Score[category][1] = score;
    }
  }

  enemyA02Assignment[scoreNames[category]] = [bestDice, maxScore];

	const removeIndex = enemyA02DiceSetCopy.indexOf(bestDice);
	if(removeIndex !== -1) enemyA02DiceSetCopy.splice(removeIndex, 1);
}

// 割り当て結果を表示
const enemyA02ScoreUpperSection = enemyA02Score.slice(0, 5 + 1).reduce((total, value) => total + value[1], 0);
let enemyA02Bonus = 0;
if(enemyA02ScoreUpperSection >= NEED_UPPER_BONUS) enemyA02Bonus = 35;
enemyA02Assignment['UpperBonus'] = ['---', enemyA02Bonus];
console.table(enemyA02Assignment);
console.log(`スコア合計値：${enemyA02Score.reduce((total, value) => total + value[1], 0) + enemyA02Bonus}`);





















/** [A03] 敵戦略3：ボーナス優先後、A02
 *
 *  特徴：まずはアッパーセクションでのボーナスを求め、その後A02ライクの挙動をする
 * 	（ボーナス達成が不可能の場合は、A02を使う）
 *
 *  課題：振り直しなしだとボーナス達成は体感1%ないくらいなので、現状A02と変わらない。
 *  TODO: Assignment の表示がおかしい、恐らくローワーセクションの最大値からインデックスを求める箇所で、最大値で別の箇所を参照している
 * 			（やるなら配列全体を使った indexOf ）
 */
let enemyA03Assignment = {};
console.log('--- 敵戦略３：ボーナス優先＋A02 ---');

// 各種配列のディープコピーを用意
let enemyA03DiceSetCopy = JSON.parse(JSON.stringify(enemyDiceSet));
let enemyA03Score = JSON.parse(JSON.stringify(emptyScore));

// テーブルデータ生成（各行は1つのダイス値の役一覧を表し、各列は役ごとの点数となる）
let enemyA03ScoreMap = enemyA03DiceSetCopy.map(calcCombinations);
const enemyA03Table = new Table(enemyA03ScoreMap);
const enemyA03TableRef = new Table(enemyA03ScoreMap); // 参照用

/** アッパーボーナス判定 */
let enemyA03UpperSectionBonus = [];
for(i = 0; i < 6; i++){
	const points = enemyA03Table.getColumn(i);
	const maxPoint = Math.max(...points);
	const index = points.indexOf(maxPoint);
	enemyA03UpperSectionBonus.push([index, maxPoint]);
}

const enemyA03SumUpperSection = enemyA03UpperSectionBonus.reduce((total, value) => total + value[1], 0);
if(enemyA03SumUpperSection >= NEED_UPPER_BONUS){
	// アッパーボーナス達成成功のため、まずは条件を満たすダイスを確定させていく
	for(i = 0; i < 6; i++){
		let [index, point] = enemyA03UpperSectionBonus[i];
		enemyA03Score[i][1] = point;

		// 参照テーブルからインデックスを調べ、ダイス値を求める（コンソール用）
		const dice = enemyA03DiceSetCopy[index];
		enemyA03Assignment[scoreNames[i]] = [dice, point];

		// テーブルから確定したダイススコアを除去
		enemyA03Table.removeRow(index);
	}

	/** 役の成立が難しい順に優先度を設定（アッパーセクションは除去） */
	const priorityA03 = [
		SCORE.categories.Fune.id,
		SCORE.categories.FourDice.id,
		SCORE.categories.LongStraight.id,
		SCORE.categories.FullHouse.id,
		SCORE.categories.ShortStraight.id,
		SCORE.categories.ThreeDice.id,
		SCORE.categories.Choice.id
	];

	for(let category of priorityA03){
		// 点数の確定
		const points = enemyA03Table.getColumn(category);
		const maxPoint = Math.max(...points);
		enemyA03Score[category][1] = maxPoint;

		// 参照テーブルからインデックスを調べ、ダイス値を求める（コンソール用）
		const arr = enemyA03TableRef.getColumn(category);
		const index = arr.indexOf(maxPoint);
		const dice = enemyA03DiceSetCopy[index];
		enemyA03Assignment[scoreNames[category]] = [dice, maxPoint];

		// 確定したダイススコアを除去
		enemyA03Table.removeRow(points.indexOf(maxPoint));
	}

} else {
	// アッパーボーナスの達成不可能なので、A02をそのまま流用する
	enemyA03Assignment = enemyA02Assignment;
	enemyA03Score = enemyA02Score
}

// 割り当て結果を表示
const enemyA03ScoreUpperSection = enemyA03Score.slice(0, 5 + 1).reduce((total, value) => total + value[1], 0);
let enemyA03Bonus = 0;
if(enemyA03ScoreUpperSection >= NEED_UPPER_BONUS) enemyA03Bonus = 35;
enemyA03Assignment['UpperBonus'] = ['---', enemyA03Bonus];
console.table(enemyA03Assignment);
console.log(`スコア合計値：${enemyA03Score.reduce((total, value) => total + value[1], 0) + enemyA03Bonus}`);



















// Enemyの行動データ
let enemyScore = [];
switch(enemyID){
	case 1: // A01: 役順に高得点を割り当てる
		enemyScore = randomizeArray(enemyA01Score);
		break;
	case 2:	// A02: A01に優先度を付与
		enemyScore = randomizeArray(enemyA02Score);
		break;
	case 3:	// A02: ボーナス優先、その後A02
		enemyScore = randomizeArray(enemyA03Score);
		break;
	default:	// 不明、もしくは検証用ダミー（全役で 0点）
		enemyScore = emptyScore;
}

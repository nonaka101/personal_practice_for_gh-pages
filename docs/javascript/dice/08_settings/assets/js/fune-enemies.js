// URLからのクエリ処理
let url = new URL(document.location);
let urlParams = url.searchParams;
const enemyID = parseInt(urlParams.get('enemy_id')) || 0;
const enemyList = ['TestDummy', 'A01', 'A02'];
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
let categories = Object.values(SCORE_CATEGORIES).slice(0, -1);

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
const enemyA01Assignment = {};
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
  enemyA01Assignment[SCORE_NAMES[category]] = [bestDice, maxScore];

  // 使用済みダイスセットから削除（同じダイス値があるケースを想定、1つのみに限定をかける）
	const removeIndex = enemyA01DiceSetCopy.indexOf(bestDice);
	if(removeIndex !== -1) enemyA01DiceSetCopy.splice(removeIndex, 1);
}

// 割り当て結果を表示
console.table(enemyA01Assignment);
console.log(`スコア合計値：${enemyA01Score.reduce((total, value) => total + value[1], 0)}`);










/** [A02] 敵戦略２：A01に優先度を付与
 *
 *  特徴：役の成立可能性が低い順にダイスを当てはめていくことで、A01より得点力を上げる
 *  （ダイスパターン 252 に対し、L-Straight: 2, Fune: 6, S-Straight: 10, FullHouse: 30, FourDice: 36, ThreeDice: 126 の組み合わせが存在）
 *
 *  課題：「役の0点を無くすこと」と「高得点を狙うこと」は微妙に違う。例えばこの方針だと、ボーナスは得にくいかもしれない。
 *        必ずA01より高得点になるとは限らない。例えば L-Straight がダイスセット内で成立しなかった場合、ダイスセットの一番最後が捨てられることになるが、それが Fune の可能性がある。
 */
const enemyA02Assignment = {};
console.log('--- 敵戦略２：A01に優先度を付与 ---');
let enemyA02Score = JSON.parse(JSON.stringify(emptyScore));

console.log(enemyA02Score);

/** 役の成立が難しい順に優先度を設定 */
const priorityA02 = [
	SCORE_CATEGORIES.Long_straight,
	SCORE_CATEGORIES.Yahzee,
	SCORE_CATEGORIES.Short_straight,
	SCORE_CATEGORIES.Full_house,
	SCORE_CATEGORIES.Four_of_a_kind,
	SCORE_CATEGORIES.Three_of_a_kind,
	SCORE_CATEGORIES.Sixes,
	SCORE_CATEGORIES.Fives,
	SCORE_CATEGORIES.Fours,
	SCORE_CATEGORIES.Threes,
	SCORE_CATEGORIES.Twos,
	SCORE_CATEGORIES.Aces
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

  enemyA02Assignment[SCORE_NAMES[category]] = [bestDice, maxScore];

	const removeIndex = enemyA02DiceSetCopy.indexOf(bestDice);
	if(removeIndex !== -1) enemyA02DiceSetCopy.splice(removeIndex, 1);
}

// 割り当て結果を表示
console.table(enemyA02Assignment);
console.log(`スコア合計値：${enemyA02Score.reduce((total, value) => total + value[1], 0)}`);






/*
// 役のスコアを計算
let diceScores = enemyDiceSet.map(calcCombinations);

// 役の割り当てを求める
function allocateScores(diceScores) {
  const used = new Array(13).fill(false);
  const allocation = new Array(13).fill(null);
  let maxScore = 0;

  function backtrack(index, currentScore) {
    if (index === 13) {
      if (currentScore > maxScore) {
        maxScore = currentScore;
        allocation.slice(0);
      }
      return;
    }

    for (let i = 0; i < 13; i++) {
      if (!used[i]) {
        used[i] = true;
        allocation[index] = i;
        backtrack(index + 1, currentScore + diceScores[index][i]);
        used[i] = false;
      }
    }
  }

  backtrack(0, 0);
  return allocation;
}

// スコアの割り当てを実行
const allocation = allocateScores(diceScores);

// 最終スコア計算
let totalScore = 0;
for (let i = 0; i < 13; i++) {
  totalScore += diceScores[i][allocation[i]];
}

console.log("ダイスセット:", enemyDiceSet);
console.log("役の割り当て:", allocation);
console.log("最終スコア:", totalScore);
*/



// Enemyの行動データ
let enemyScore = [];
switch(enemyID){
	case 1: // A01: 役順に高得点を割り当てる
		enemyScore = randomizeArray(enemyA01Score);
		break;
	case 2:	// A02: A01に優先度を付与
		enemyScore = randomizeArray(enemyA02Score);
		break;
	default:	// 不明、もしくは検証用ダミー（全役で 0点）
		for (let i = 0; i <= 12; i++) {
			enemyScore.push([i, 0]);
		}
}

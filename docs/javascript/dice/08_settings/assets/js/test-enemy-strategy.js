/*
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
})

function calcCombinations(num){
  // 入力値の検証（数値としての、5桁のダイス値）
  const regex = /^[1-6]{5}$/;
  if(!regex.test(String(num))) throw new Error('引数は5桁のダイス値でなければなりません');

  // ソートした配列とセットに変換
  const dices = String(num).split('').map(Number).sort();
  const uniqDices = new Set(dices);

  // ダイスの合計値（スコア計算用）
  const totalDices = dices.reduce((a, b) => a + b, 0);

  // 13役を格納する配列
  const combinations = new Array(13).fill(0);

  for(let i = SCORE_CATEGORIES.Aces, d = 1; i <= SCORE_CATEGORIES.Sixes; i++, d++){
    const filtered = dices.filter((item) => item === d);
    combinations[i] = d * filtered.length;
  }

  // Lower Section
  // Chance（得点：ダイス合計値）
  combinations[SCORE_CATEGORIES.Chance] = totalDices;

  if(uniqDices.size < 4){
    if((uniqDices.size === 2) && (dices[1] !== dices[3])) combinations[SCORE_CATEGORIES.Full_house] = 25;

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
*/



// ダイスセットを生成
let diceSet = [];
for(let i = 0; i < 13; i++){
  let dices = '';
  for(let j = 0; j < 5; j++){
    dices += String(Math.floor(Math.random() * 6) + 1);
  }
	dices = dices.split('').map(Number).sort().toString().replace(/,/gui,'');
  diceSet.push(dices);
}

console.table(diceSet);





















/** 敵戦略１：役順に高得点を当てはめていく
 *
 *  特徴：役順に未割り当てのダイスを当てはめ、高得点になるものを割り当てる
 *
 *  課題：後方にある役の方が最善手でも前方の役に割り当てることがある
 * （例：11222 でも、場合によってはフルハウスでもスリーダイスでも、まして 2の目でもなく 1の目に割り当てられる）
 */
const enemy1Assignment = {};

// diceSet 要素を弄るため ディープコピーを用意
let diceSetCopy = JSON.parse(JSON.stringify(diceSet));

// 各役について、最適なダイス値を見つける
for (const category of Object.values(SCORE_CATEGORIES)) {
  // 未割り当てのダイスセット
  const unassignedDiceSet = [...diceSetCopy];

  // 現在の役の最高得点
  let maxScore = 0;
  // 現在の役に対応する最適なダイス値
  let bestDice = '';

  // 未割り当てのダイスセットをすべて試す
  for (const dices of unassignedDiceSet) {
    // 現在のダイス値で役のスコアを計算
    const score = calcCombinations(dices)[category];

    // 現在の役の最高得点を超えていれば更新
    if (score > maxScore) {
      maxScore = score;
      bestDice = dices;
    }
  }

  // 役と最適なダイス値を割り当て
  enemy1Assignment[category] = bestDice;

  // 使用済みダイスセットから削除
  diceSetCopy = diceSetCopy.filter(dice => dice !== bestDice);
}

// 割り当て結果を表示（TODO：最善手とは言いづらい、別途 priority を設けて当てはめる役の順序を整えることを考慮）
console.log(enemy1Assignment);
















/*
// 役のスコアを計算
let diceScores = diceSet.map(calcCombinations);

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

console.log("ダイスセット:", diceSet);
console.log("役の割り当て:", allocation);
console.log("最終スコア:", totalScore);
*/


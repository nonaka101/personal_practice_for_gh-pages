const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

function findNullIndices(arr) {
	let indices = [];
	arr.forEach((element, index) => {
			if (element === null) {
					indices.push(index);
			}
	});
	return indices;
}

async function roleEffect(element, className, ms = 500){
	element.classList.add(className);
	await wait(ms);
	element.classList.remove(className);
}

/**
 * テーブルスタイルを enum 風に管理
 */
const TABLE_STYLE = Object.freeze({
	none: 0,							// ベース
	horizontal: 1,				// 水平（行方向に重きを置く表）
	vertical: 2,					// 垂直（列方向に重きを置く表）
	cross: 3,							// クロス（行列組み合わせた表）
	noneWide: 4,					// ベース＋ワイド（列数が多めで、横方向へスクロールするスタイルの幅が広め）
	horizontalWide: 5,
	verticalWide: 6,
	crossWide: 7,
	noneWideEx: 8,				// ベース＋EXワイド（列数が更に多く、ワイドよりも更に広め）
	horizontalWideEx: 9,
	verticalWideEx: 10,
	crossWideEx: 11,
});

function createTable(dataArray, tableStyle=0) {
	const styleWidth = Math.floor(tableStyle / 4);
	const styleDirection = tableStyle % 4;

	// テーブルのラップ要素 div の生成
	const tableWrapper = document.createElement('div');
	let classes = ['bl_table'];
	switch (styleDirection) {
		case 0:
			break;
		case 1:
			classes.push('bl_table__horizontal');
			break;
		case 2:
			classes.push('bl_table__vertical');
			break;
		case 3:
			classes.push('bl_table__cross');
			break;
	}
	switch (styleWidth) {
		case 0:
			break;
		case 1:
			classes.push('bl_table__wide');
			break;
		case 2:
			classes.push('bl_table__exWide');
			break;
	}
	tableWrapper.classList.add(...classes);

	const table = document.createElement('table');
	tableWrapper.appendChild(table);

	// ヘッダー部を作成
	const tableHeaderRow = table.createTHead().insertRow();
	const arrayHeader = dataArray.shift();
	let isFirstCell = true;	// クロス表の表側頭で scope をつけないためのもの
	for(const cell of arrayHeader){
		const th = document.createElement('th');
		th.textContent = cell;

		// 表形式が 垂直 または クロスかつ表側頭セル以外の場合、スコープ付与
		if((styleDirection === 2) || (styleDirection === 3 && isFirstCell === false)) {
			th.scope = 'col';
		}
		tableHeaderRow.appendChild(th);
		isFirstCell = false;
	}

	// ボディ部を作成
	const tableBody = table.createTBody();
	for (const arrayRow of dataArray) {
		const row = tableBody.insertRow();

		// 初回のみ th 要素
		const thCell = arrayRow.shift();
		const th = document.createElement('th');
		th.textContent = thCell;
		if(styleDirection === 1 || styleDirection === 3) {
			th.scope = 'row';
		}
		row.appendChild(th);

		// 2列目以降は td 要素
		for(const tdCell of arrayRow){
			const cell = row.insertCell();
			cell.textContent = tdCell;
		}
	}

	// テーブル要素を格納した div.bl_table 要素を返す
	return tableWrapper;
}
// Template
const TEMP_DIEFACES = Object.freeze({
	1: document.querySelector('#js_dieFace_1'),
	2: document.querySelector('#js_dieFace_2'),
	3: document.querySelector('#js_dieFace_3'),
	4: document.querySelector('#js_dieFace_4'),
	5: document.querySelector('#js_dieFace_5'),
	6: document.querySelector('#js_dieFace_6'),
});

let url = new URL(document.location);
let urlParams = url.searchParams;
const enemyID = parseInt(urlParams.get('enemy_id')) || 0;
const enemyList = ['検証用ダミー', 'CPU弱'];
const selEnemy = document.querySelector('#js_decision_strategy');
selEnemy.innerHTML = '';
for (let i = 0; i < enemyList.length; i++){
	const opt = document.createElement('option');
	opt.value = i;
	opt.text = enemyList[i];
	if (enemyID === i) opt.selected = true;
	selEnemy.add(opt, selEnemy.options.item(i));
}

// クエリ付きでリロードする関数（CPU変更や、ゲーム終了時に使用）
function reloadWithQuery(){
	urlParams.set('enemy_id', selEnemy.value);
	window.location.href = url.href;
}

// Enemyの行動データ
let enemyScore = [];
switch(enemyID){
	case 1:
		for (let i = 0; i <= 12; i++) {
			enemyScore.push([i, i]);
		}
		break;
	default:	// 不明、もしくは0
		for (let i = 0; i <= 12; i++) {
			enemyScore.push([i, 0]);
		}
}


class Controller {
	constructor(player, form){
		this.remainTime = 3;
		this.player = player;
		this.form = form;

		// form内要素の定義
		this.rollBtn = form.querySelector('#js_roll');
		this.rollBtnRemain = form.querySelector('#js_roll_remain');	// span;
		this.diceContainer = form.querySelector('#js_dice');	// div;
		this.select = form.querySelector('#js_decision_combination');
		this.output = form.querySelector('#js_dice_output');	// SR用 output

		// [dieFace, lock] の形で、5つのダイスを状態管理
		this.diceStatus = [[1, false], [1, false], [1, false], [1, false], [1, false]];
		this.dices = [];
		for(let i = 0; i < 5; i++){
			this.dices[i] = {};

			// Label
			const diceElement = document.createElement('label');
			diceElement.classList.add('bl_dice');
			this.dices[i].label = diceElement;

			// CheckBox
			const chkbox = document.createElement('input');
			chkbox.type = 'checkbox';
			chkbox.checked = this.diceStatus[i][1];
			chkbox.name = 'dice' + i;
			chkbox.classList.add('bl_dice_chkbox');
			this.dices[i].chkbox = chkbox;

			// Append Container node(ChkBox, SVG -> diceContainer)
			this.dices[i].label.appendChild(this.dices[i].chkbox);
			this.dices[i].label.appendChild(TEMP_DIEFACES[this.diceStatus[i][0]].content.cloneNode(true));
			this.diceContainer.appendChild(this.dices[i].label);
		}

		// 役情報の格納（確定済みの役を除外した上での [index, point] の形）
		this.combinations = [];

		// Submit 時のイベントハンドラ関数（Playerのスコアを決定し、Submitイベントを除去）
		this.decide = (event) => {
			event.preventDefault();
			this.diceContainer.innerHTML = '';  // ChildNode がなくなるまで removeChild する必要はなし
			const scoreIndex = parseInt(this.select.value) || 0;
			this.player.setScore(this.combinations[scoreIndex][0], this.combinations[scoreIndex][1]);
			this.form.removeEventListener('submit', this.decide);
		}

		// Submitボタン押下、またはフォーム内エンターでのサブミット処理
		this.form.addEventListener('submit', this.decide);
		this.rollBtn.addEventListener('click',()=>{
			this.roll();
		});

		this.roll();
	}

	roll(){
		if(this.remainTime > 0){
			this.remainTime -= 1;
			let newStatus = [];

			// Lock 状態を取得し、diceStatus を更新。その後ロール処理
			for(let i = 0; i < 5; i++){
				roleEffect(this.dices[i].label, 'js_anime_roll');
				this.diceStatus[i][1] = this.dices[i].chkbox.checked;
				if(this.diceStatus[i][1] === true){
					// Lock 状態ならそのまま移行
					newStatus.push(this.diceStatus[i]);
				} else {
					// Unlock 状態なら、ダイスを振って登録
					newStatus.push([Math.floor(Math.random() * 6) + 1, false]);
				}
			}

			// ソートしたものを登録
			this.diceStatus = newStatus.sort((a, b) => a[0] - b[0]);

			// ダイス値からのポイント判定
			let dieFaces = '';
			for(let i = 0; i < 5;i++) dieFaces += this.diceStatus[i][0].toString();
			const points = calcCombinations(dieFaces);

			// 確定済みを除去した、選択可能な役情報の作成（select用に、高得点順にソート）
			const nulls = findNullIndices(this.player.score.slice(0, -1));
			let combinations = []
			for(let i of nulls) combinations.push([i, points[i]]);
			this.combinations = combinations.sort((a, b) => b[1] - a[1]);;

			this.refreshControl();
		}
	}
	refreshControl(){
		// ロールボタンの更新（残回数0なら disabled 化）
		this.rollBtnRemain.textContent = this.remainTime;
		this.rollBtn.disabled = (this.remainTime === 0);


		// ダイス更新（diceStatus から checked, svg, aria-label を更新）
		let outputText = '';
		for(let i = 0; i < 5; i++){
			outputText += this.diceStatus[i][0] + ' ';
			this.dices[i].chkbox.checked = this.diceStatus[i][1];
			const newSvg = TEMP_DIEFACES[this.diceStatus[i][0]].content.cloneNode(true);
			this.dices[i].label.replaceChild(newSvg, this.dices[i].label.querySelector('svg'));
			this.dices[i].label.ariaLabel = this.diceStatus[i][0];
		}

		// ダイス状態をスクリーンリーダー用に通知
		this.output.textContent = outputText;

		// 役のセレクト内容を更新
		this.select.innerHTML = '';
		const length = this.combinations.length;
		for(let i = 0; i < length; i++){
			// value に this.combination へのインデックスを持つ、オプション要素
			const opt = document.createElement('option');
			opt.value = i;
			opt.text = `${SCORE_NAMES[this.combinations[i][0]]}：${this.combinations[i][1]}`;
			this.select.add(opt, this.select.options.item(i));
		}
	}
}

const form = document.querySelector('#js_controller');
const pName = 'プレイヤー1';
const p1 = new Player(pName);
const e1 = new Enemy(enemyList[enemyID], enemyScore);
const gm = new GameMaster(p1, e1);

let ctrl = new Controller(p1, form);


const resultDialog = document.querySelector('#js_resultDialog');

const playerNames = document.querySelectorAll('.js_player_name');
for(const ele of playerNames) ele.textContent = pName;

const enemyNames = document.querySelectorAll('.js_enemy_name');
for(const ele of enemyNames) ele.textContent = enemyList[enemyID];

const playerScoreTable = document.querySelectorAll('.js_player_score');
const playerTotalScore = document.querySelectorAll('.js_player_totalScore');
const enemyScoreTable = document.querySelectorAll('.js_enemy_score');
const enemyTotalScore = document.querySelectorAll('.js_enemy_totalScore');

function updateScore(){
	for(const ele of playerTotalScore){
		ele.textContent = p1.totalScore;
	}
	for(const ele of enemyTotalScore){
		ele.textContent = e1.totalScore;
	}
	const scoreNames = Object.values(SCORE_NAMES);
	for(const ele of playerScoreTable){
		ele.innerHTML = '';
		let pTable = [['点数', '役']];
		const p1score = p1.score;
		for(i=0; i<14; i++) pTable.push([p1score[i], scoreNames[i]]);
		const pTableElement = createTable(pTable,2);
		ele.append(pTableElement);
	}
	for(const ele of enemyScoreTable){
		ele.innerHTML = '';
		let eTable = [['点数', '役']];
		const e1score = e1.score;
		for(i=0; i<14; i++) eTable.push([e1score[i], scoreNames[i]]);
		const eTableElement = createTable(eTable,2);
		ele.appendChild(eTableElement);
	};
}
updateScore();

document.addEventListener('handover', (e) => {
	updateScore();
	let isPlayer = e.detail.isPlayer;
	if (isPlayer) {
		gm.update();
		if (!gm.isFinished) {
			console.log(`${e1.name} のターンです。`);
			e1.setDummyData();
			ctrl = new Controller(p1, form);
		} else {
			resultDialog.showModal();
		}
	} else {
		gm.update();
		if (!gm.isFinished) {
			console.log(`${p1.name} のターンです。`);
		} else {
			resultDialog.showModal();
		}
	}
})

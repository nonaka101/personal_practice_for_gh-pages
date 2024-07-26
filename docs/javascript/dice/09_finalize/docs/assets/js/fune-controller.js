async function roleEffect(element, className, ms = 500){
	element.classList.add(className);
	await wait(ms);
	element.classList.remove(className);
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



/*
 * 「ダイアログを開くボタン」に機能を付与
 *  1. button 要素には `js_btnDialog` クラスが必要
 *  2. button 要素には、操作先 dialog のID名が入った aria-controls 属性が必要
 */
const dialogBtns = document.querySelectorAll('.js_btnShowDialog');
for (const btn of dialogBtns) {
	const dialogId = btn.getAttribute('aria-controls');
	if(dialogId){
		const targetDialog = document.querySelector(`#${dialogId}`);
		if(targetDialog){
			btn.addEventListener('click', ()=>{
				targetDialog.showModal();
			})
		}
	}
}

/*
 * 「ダイアログを閉じるボタン」に機能を付与
 *  1. button 要素には `js_btnCloseDialog` クラスが必要
 *  2. button 要素には、操作先 dialog のID名が入った aria-controls 属性が必要
 */
const dialogCloseBtns = document.querySelectorAll('.js_btnCloseDialog');
for (const btn of dialogCloseBtns) {
	// 対象ダイアログと結びつけ、閉じる機能を実装
	const dialogId = btn.getAttribute('aria-controls');
	if(dialogId){
		const targetDialog = document.querySelector(`#${dialogId}`);
		if(targetDialog){
			btn.addEventListener('click', ()=>{
				targetDialog.close();
			})
		}
	}
}














/* ≡≡≡ ▀▄ 共通設定 ▀▄ ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
	■ 概要
		全体に共通する機能の設定値を、セッションストレージで保管する。各設定値は、下記とする。
		1. colorMode -> [0:default, 1:light, 2:dark]
		2. fontSize -> [0:default, 10〜32:該当のpx値]
		3. isLeft -> [false:右, true:左]
		4. enableSound -> [false:off, true:on]
---------------------------------------------------------------------------- */

/**
 * セッション中に維持保存される、カラーモード設定情報
 *
 * @param {boolean} isShow - 機能が有効化されているか
 * @param {boolean} isDark - ダークモード設定か
 */
let settingState;
if (sessionStorage.getItem('settingState')){
	settingState = sessionStorage.getItem('settingState');
	settingState = JSON.parse(settingState);
} else {
	settingState = {
		colorMode: 0,
		fontSize: 0,
		isLeft: false,
		enableSound: false,
		enableVibration: false,
	}
}








/**
 * カラーモード機能の手動切り替え
 *
 * bodyへのクラス付与とCSSによって、カラーモードを手動操作
 *
 * @param {string} colorMode - [0:defalut, 1:light, 2:dark]
 */
function changeColorMode(colorMode) {
	switch (parseInt(colorMode)) {
		case 0:
			document.documentElement.classList.remove("is_darkMode");
			document.documentElement.classList.remove("is_lightMode");
			break;
		case 1:
			document.documentElement.classList.remove("is_darkMode");
			document.documentElement.classList.add("is_lightMode");
			break;
		case 2:
			document.documentElement.classList.remove("is_lightMode");
			document.documentElement.classList.add("is_darkMode");
			break;
		default:
			console.log(`Unknown setting value detected: colorMode -> ${colorMode}`);
	}
}

const selColorMode = document.querySelector('#js_setting_colorMode');
selColorMode.addEventListener("change", (e) => {
	const val = e.target.value;
	changeColorMode(val);
	settingState.colorMode = val;
	sessionStorage.setItem('settingState', JSON.stringify(settingState));
})

// 初期状態の反映
selColorMode.value = settingState.colorMode;
changeColorMode(settingState.colorMode);





/**
 * フォントサイズの手動切り替え
 *
 * bodyへのスタイル付与によって、フォントサイズを手動操作
 *
 * @param {string} fontSize - 0でdefalut、それ以外の数値は対応するpx値とする
 */
function changeFontSize(fontSize) {
	let size = parseInt(fontSize);
	if (size === 0) {
		document.documentElement.style.fontSize = null;
	} else {
		if (typeof size === "number"){
			document.documentElement.style.fontSize = size + 'px';
		} else {
			console.log(`Unknown setting value detected: fontSize -> ${fontSize}`);
		}
	}
}

const selFontSize = document.querySelector('#js_setting_fontSize');
selFontSize.addEventListener("change", (e) => {
	const val = e.target.value;
	changeFontSize(val);
	settingState.fontSize = val;
	sessionStorage.setItem('settingState', JSON.stringify(settingState));
})

// 初期状態の反映
selFontSize.value = settingState.fontSize;
changeFontSize(settingState.fontSize);





/**
 * 左利きモードへの切り替え
 *
 * bodyへのクラス付与によって、左利き用のスタイルに変更
 *
 * @param {boolean} isLeft - true で左利きモード
 */
function changeLeftMode(isLeft) {
	if (isLeft) {
		document.documentElement.classList.add("is_leftMode");
	} else {
		document.documentElement.classList.remove("is_leftMode");
	}
}

const chkIsLeft = document.querySelector('#js_setting_isLeft');
chkIsLeft.addEventListener("change", (e) => {
	const val = e.target.checked;
	changeLeftMode(val);
	settingState.isLeft = val;
	sessionStorage.setItem('settingState', JSON.stringify(settingState));
})

// 初期状態の反映
chkIsLeft.checked = settingState.isLeft;
changeLeftMode(settingState.isLeft);





/**
 * サウンドモードへの切り替え
 *
 * bodyへのクラス付与によって、音有りのスタイルに変更（暫定）
 *
 * @param {boolean} enableSound - true で音有りモード
 */
function changeSoundMode(enableSound) {
	if (enableSound) {
		document.documentElement.classList.add("is_soundMode");
	} else {
		document.documentElement.classList.remove("is_soundMode");
	}
}

const chkEnableSound = document.querySelector('#js_setting_enableSound');
chkEnableSound.addEventListener("change", (e) => {
	const val = e.target.checked;
	changeSoundMode(val);
	settingState.enableSound = val;
	sessionStorage.setItem('settingState', JSON.stringify(settingState));
})

// 初期状態の反映
chkEnableSound.checked = settingState.enableSound;
changeSoundMode(settingState.enableSound);

// 機能の確認
var isEnabledSound = false;
if((window.AudioContext || window.webkitAudioContext) === undefined) {
	// AudioContext による ビープ生成 未対応
	let textLabel = 'This device is not supported.';
	if(document.documentElement.lang === 'ja') textLabel = 'この機器は未対応です';
	chkEnableSound.parentElement.lastChild.textContent = textLabel;
	chkEnableSound.disabled = true;
} else {
	isEnabledSound = true;
}


// 音源の用意
let soundEffects = [];
soundEffects[0] = new Audio("./assets/se/roll_1.mp3");
soundEffects[1] = new Audio("./assets/se/roll_2.mp3");
soundEffects[2] = new Audio("./assets/se/roll_3.mp3");


















// UpperBonus 取得条件（スコア値）を設定
const needUpperBonus = document.querySelectorAll('.js_needScore_upperBonus');
for(const ele of needUpperBonus){
	ele.textContent = NEED_UPPER_BONUS;
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
			// ロール処理に成功したため残回数を減らす
			this.remainTime -= 1;

			// サウンドを許可してる場合、音を鳴らす（3種類からランダムに）
			if (
				(chkEnableSound.checked === true)&&
				(isEnabledSound === true)
			){
				soundEffects[Math.floor(Math.random() * 3)].cloneNode().play();
			}

			// Lock 状態を取得し、diceStatus を更新。その後ロール処理
			let newStatus = [];
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
			opt.text = `${scoreNames[this.combinations[i][0]]}：${this.combinations[i][1]}`;
			this.select.add(opt, this.select.options.item(i));
		}
	}
}

const form = document.querySelector('#js_controller');
const pName = 'Player';
const p1 = new Player(pName);

/** enemyScore は、`fune-enemies.js` 側に格納 */
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
const playerUpperScore = document.querySelectorAll('.js_player_upperScore');
const enemyScoreTable = document.querySelectorAll('.js_enemy_score');
const enemyTotalScore = document.querySelectorAll('.js_enemy_totalScore');
const enemyUpperScore = document.querySelectorAll('.js_enemy_upperScore');
const winnerName = document.querySelectorAll('.js_winner_name');

function updateScore(){
	// Refresh totalScore
	for(const ele of playerTotalScore){
		ele.textContent = p1.totalScore;
	}
	for(const ele of enemyTotalScore){
		ele.textContent = e1.totalScore;
	}

	// Refresh upperScore
	for(const ele of playerUpperScore){
		ele.textContent = p1.upperScore;
	}
	for(const ele of enemyUpperScore){
		ele.textContent = e1.upperScore;
	}

	// Refresh ScoreTable
	for(const ele of playerScoreTable){
		ele.innerHTML = '';
		let pTable = [['Point', 'Combinations']];
		const p1score = p1.score;
		for(i=0; i<14; i++) pTable.push([p1score[i], scoreNames[i]]);
		const pTableElement = createTable(pTable,2);
		ele.append(pTableElement);
	}
	for(const ele of enemyScoreTable){
		ele.innerHTML = '';
		let eTable = [['Point', 'Combinations']];
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
		if (!gm.winner) {
			console.log(`${e1.name}'s turn.`);
			e1.setDummyData();
			ctrl = new Controller(p1, form);
		} else {
			// Result dialog update (when game is finished)
			for(const ele of winnerName) ele.textContent = gm.winner;
			resultDialog.showModal();
		}
	} else {
		gm.update();
		if (!gm.winner) {
			console.log(`${p1.name}'s turn.`);
		} else {
			// Result dialog update (when game is finished)
			for(const ele of winnerName) ele.textContent = gm.winner;
			resultDialog.showModal();
		}
	}
})

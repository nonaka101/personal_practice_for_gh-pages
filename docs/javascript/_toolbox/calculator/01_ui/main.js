
/* ≡≡≡ ▀▄ 共通設定 ▀▄ ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
	■ 概要
		全体に共通する機能の設定値を、セッションストレージで保管する。各設定値は、下記とする。
		1. colorMode -> [0:default, 1:light, 2:dark]
		2. fontSize -> [0:default, 10〜32:該当のpx値]
		3. isLeft -> [false:右, true:左]
		4. enableSound -> [false:off, true:on]
		5. enableVibration -> [false:off, true:on]
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
 * @param {int} colorMode - [0:defalut, 1:light, 2:dark]
 */
function changeColorMode(colorMode) {
	switch (colorMode) {
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
			console.log(`不明な設定値が検出されました [colorMode : ${colorMode}]`);
	}
}

const selColorMode = document.querySelector('#js_setting_colorMode');
selColorMode.addEventListener("change", (e) => {
	const val = parseInt(e.target.value);
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
 * @param {int} fontSize - 0でdefalut、それ以外の数値は対応するpx値とする
 */
function changeFontSize(fontSize) {
	if (fontSize === 0) {
		document.documentElement.style.fontSize = null;
	} else {
		if (typeof fontSize === "number"){
			document.documentElement.style.fontSize = fontSize + 'px';
		} else {
			console.log(`不明な設定値が検出されました [fontSize : ${fontSize}]`);
		}
	}
}

const selFontSize = document.querySelector('#js_setting_fontSize');
selFontSize.addEventListener("change", (e) => {
	const val = parseInt(e.target.value);
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







/**
 * 振動モードへの切り替え
 *
 * bodyへのクラス付与によって、振動有りのスタイルに変更（暫定）
 *
 * @param {boolean} enableVibration - true で振動有りモード
 */
function changeVibrationMode(enableVibration) {
	if (enableVibration) {
		document.documentElement.classList.add("is_vibrationMode");
	} else {
		document.documentElement.classList.remove("is_vibrationMode");
	}
}

const chkEnableVibration = document.querySelector('#js_setting_enableVibration');
chkEnableVibration.addEventListener("change", (e) => {
	const val = e.target.checked;
	changeVibrationMode(val);
	settingState.enableVibration = val;
	sessionStorage.setItem('settingState', JSON.stringify(settingState));
})

// 初期状態の反映
chkEnableSound.checked = settingState.enableSound;
changeSoundMode(settingState.enableSound);













// 各種要素の取得
const btnCalculator = document.getElementById('js_btn_calc');
const dialogCalculator = document.getElementById('js_dialog_calculator');

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




/*
Escは要素自体に機能を付与

#js_calcBtn_AllClear
#js_calcBtn_BackSpace
#js_calcBtn_Copy
#js_calcBtn_1
#js_calcBtn_2
#js_calcBtn_3
#js_calcBtn_4
#js_calcBtn_5
#js_calcBtn_6
#js_calcBtn_7
#js_calcBtn_8
#js_calcBtn_9
#js_calcBtn_0
#js_calcBtn_DecimalPoint
#js_calcBtn_Equal
#js_calcBtn_Add
#js_calcBtn_Subtract
#js_calcBtn_Multiply
#js_calcBtn_Devide
*/
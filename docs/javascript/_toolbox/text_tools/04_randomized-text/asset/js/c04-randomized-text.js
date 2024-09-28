
function chooseRandomChar(chars){
	return chars.charAt(Math.floor(Math.random() * chars.length));
}

const c04_btnCalc = document.querySelector('#c04js_calcBtn');
const c04_output = document.querySelector('#c04js_output');

// 各種チェックボックス
let c04_flgAlphabetUpper = document.querySelector('#c04js_chk_alphaUpper') ? document.querySelector('#c04js_chk_alphaUpper').checked : false;
let c04_flgDigit = document.querySelector('#c04js_chk_digit') ? document.querySelector('#c04js_chk_digit').checked : false;
let c04_flgSymbol1 = document.querySelector('#c04js_chk_symbol1') ? document.querySelector('#c04js_chk_symbol1').checked : false;
let c04_flgSymbol2 = document.querySelector('#c04js_chk_symbol2') ? document.querySelector('#c04js_chk_symbol2').checked : false;
let c04_flgSymbol3 = document.querySelector('#c04js_chk_symbol3') ? document.querySelector('#c04js_chk_symbol3').checked : false;
let c04_flgSymbol4 = document.querySelector('#c04js_chk_symbol4') ? document.querySelector('#c04js_chk_symbol4').checked : false;
let c04_flgSymbol5 = document.querySelector('#c04js_chk_symbol5') ? document.querySelector('#c04js_chk_symbol5').checked : false;
let c04_flgConfuzingChar = document.querySelector('#c04js_chk_removeConfuze') ? document.querySelector('#c04js_chk_removeConfuze').checked : false;

// 文字列の長さ
const c04_numTextLength = document.querySelector('#c04js_num_textLength') ? parseInt(document.querySelector('#c04js_num_textLength').value) : 8;
// 小文字への偏り（0: 偏りなし  1: 必要最小文以外は全て小文字）
const c04_sliderFreq = document.querySelector('#c04js_slider_frequency') ? parseFloat(document.querySelector('#c04js_slider_frequency').value) : 0;

c04_btnCalc.addEventListener('click', () =>{
	const alphabetsLower = 'abcdefghijklmnopqrstuvwxyz';
	const alphabetsUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const digits = '0123456789';

	// TODO: シンボル分割をもう少し理論的に整理
	const symbols1 = '-';
	const symbols2 = '!_@#$%&+=';
	const symbols3 = '~^|/*\\:;,.?';
	const symbols4 = String.raw`"'\``;
	const symbols5 = '(){}[]<>';

	// 使用する文字列郡
	let allChars = [];
	allChars.push(alphabetsLower);
	if (c04_flgAlphabetUpper) allChars.push(alphabetsUpper);
	if (c04_flgDigit) allChars.push(digits);
	if (c04_flgSymbol1) allChars.push(symbols1);
	if (c04_flgSymbol2) allChars.push(symbols2);
	if (c04_flgSymbol3) allChars.push(symbols3);
	if (c04_flgSymbol4) allChars.push(symbols4);
	if (c04_flgSymbol5) allChars.push(symbols5);

	// TODO: 強度に応じて、いくつかに分割？
	const confuzingChars = 'oO0l17zZ2b6g9cCkKpPsSuUvVwWxXyY';
	if (c04_flgConfuzingChar) {
    allChars = allChars.map(charSet => {
        return charSet.split('').filter(char => !confuzingChars.includes(char)).join('');
    });
	}

	// 採用した文字群から、最低1字は使用する
	let resultChars = [];
	for(const str of allChars){
		resultChars.push(chooseRandomChar(str));
	}

	let remainLength = c04_numTextLength - resultChars.length;
	let freqChars = Array(allChars.length).fill(0);
	freqChars[0] = Math.floor(remainLength * c04_sliderFreq);
	remainLength -= freqChars[0];

	// 残り回数を振り分け
	let index = 0;
	while (remainLength > 0) {
		freqChars[index]++;
		remainLength--;
		index = (index + 1) % freqChars.length;  // インデックスを循環させる
	}

	// 残り回数に応じた文字群取得
	for (let i = 0; i < allChars.length; i++) {
		if(freqChars[i]){
			for(let k = 1; k < freqChars[i]; k++){
				resultChars.push(chooseRandomChar(allChars[i]));
			}
		}
	}

	console.log(resultChars);
});

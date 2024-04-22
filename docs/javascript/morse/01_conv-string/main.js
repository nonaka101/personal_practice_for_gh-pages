const MORSE_CODE = Object.freeze({
  encode: {
    'a': '.-',
    'b': '-...',
    'c': '-.-.',
    'd': '-..',
    'e': '.',
    'f': '..-',
    'g': '--.',
    'h': '....',
    'i': '..',
    'j': '.---',
    'k': '-.-',
    'l': '.-..',
    'm': '--',
    'n': '-.',
    'o': '---',
    'p': '.--.',
    'q': '--.-',
    'r': '.-.',
    's': '...',
    't': '-',
    'u': '..--',
    'v': '...-',
    'w': '.--',
    'x': '-..-',
    'y': '-.--',
    'z': '--..',
    '0': '-----',
    '1': '.----',
    '2': '..---',
    '3': '...--',
    '4': '....-',
    '5': '.....',
    '6': '-....',
    '7': '--...',
    '8': '---..',
    '9': '----.',
    '.': '.-.-.-',
    ',': '--..--',
    '?': '..--..',
    '!': '-.-.--',
    '/': '.-..-.-',
    '-': '-....-',
    '(': '-.--.',
    ')': '-.--.-',
    '&': '.-...',
    ':': '---...',
    ';': '-.-.-.',
    '=': '.-.-.',
    '+': '.-.-. ',
    '_': '..--.-',
    '"': '.-..-.',
    '$': '...-..-',
    '@': '.--.-.'
  },
  decode: {
    '.-': 'a',
    '-...': 'b',
    '-.-.': 'c',
    '-..': 'd',
    '.': 'e',
    '..-': 'f',
    '--.': 'g',
    '....': 'h',
    '..': 'i',
    '.---': 'j',
    '-.-': 'k',
    '.-..': 'l',
    '--': 'm',
    '-.': 'n',
    '---': 'o',
    '.--.': 'p',
    '--.-': 'q',
    '.-.': 'r',
    '...': 's',
    '-': 't',
    '..--': 'u',
    '...-': 'v',
    '.--': 'w',
    '-..-': 'x',
    '-.--': 'y',
    '--..': 'z',
    '-----': '0',
    '.----': '1',
    '..---': '2',
    '...--': '3',
    '....-': '4',
    '.....': '5',
    '-....': '6',
    '--...': '7',
    '---..': '8',
    '----.': '9',
    '.-.-.-': '.',
    '--..--': ',',
    '..--..': '?',
    '-.-.--': '!',
    '.-..-.-': '/',
    '-....-': '-',
    '-.--.': '(',
    '-.--.-': ')',
    '.-...': '&',
    '---...': ':',
    '-.-.-.': ';',
    '.-.-.': '=',
    '.-.-. ': '+',
    '..--.-': '_',
    '.-..-.': '"',
    '...-..-': '$',
    '.--.-.': '@'
  }
});

function convChrMorse2Num(strMorse){
	let result = '';
	for (let chr of String(strMorse)) {
		result += String(chr).replace('.', '1').replace('-', '111') + '0';
	}
	return result;
}

function convChrNum2Morse(strNum) {
	let result = '';
	let arr = String(strNum).split('0');
	for (const code of arr) {
		if (code === '1'){
			result += '.';
		} else {
			result += '-';
		}
	}
	return result;
}

function removeTrailingZeroes(str) {
  // 末尾からループし、'0'以外の文字が見つかったらループを抜ける
  for (let i = str.length - 1; i >= 0; i--) {
    if (str[i] !== '0') {
      return str.substring(0, i + 1);
    }
  }
  // 文字列全体が '0' の場合
  return '';
}

function convText2Num(text){
  let result = '';
  let words = text.toLowerCase().split(' ');
  for (const word of words) {
    for (const char of word) {
      console.log(char);
      result += convChrMorse2Num(MORSE_CODE.encode[char]);
      result += '00';
    }
    result += '0000';
  }
  return removeTrailingZeroes(result);
}

function convText2Morse(text){
  let result = '';
  let words = text.toLowerCase().split(' ');
  for (const word of words) {
    for (const char of word) {
      result += MORSE_CODE.encode[char];
      result += ' ';
    }
    result += '  ';
  }
  return result.trimEnd();
}

const inputText = document.querySelector('#js_morse_input');
const outputText2Num = document.querySelector('#js_morse_output__num');
const outputText2Code = document.querySelector('#js_morse_output__code');
const btnSubmit = document.querySelector('#js_morse_submit');

btnSubmit.addEventListener('click', ()=> {
  const num = convText2Num(inputText.value);
  outputText2Num.textContent = num;
  inputTextNum.value = num;

  const code = convText2Morse(inputText.value);
  outputText2Code.textContent = code;
  inputTextCode.value = code;
})

function convNum2Text(strNums){
  let result = ``;
  let words = strNums.split('0000000');
  for (const word of words){
    let chars = word.split('000');
    for (const char of chars){
      result += MORSE_CODE.decode[convChrNum2Morse(char)];
    }
    result += ' ';
  }
  return result;
}

const inputTextNum = document.querySelector('#js_morse_input__num');
const outputNum2Text = document.querySelector('#js_morse_output__text1');
const btnSubmitNum = document.querySelector('#js_morse_submit__num');
btnSubmitNum.addEventListener('click', ()=> {
  outputNum2Text.textContent = convNum2Text(inputTextNum.value);
})

function convCode2Text(strCode){
  let result = ``;
  let words = strCode.split('   ');
  for (const word of words){
    let chars = word.split(' ');
    for (const char of chars){
      result += MORSE_CODE.decode[char];
    }
    result += ' ';
  }
  return result;
}

const inputTextCode = document.querySelector('#js_morse_input__code');
const outputCode2Text = document.querySelector('#js_morse_output__text2');
const btnSubmitCode = document.querySelector('#js_morse_submit__code');
btnSubmitCode.addEventListener('click', ()=> {
  outputCode2Text.textContent = convCode2Text(inputTextCode.value);
})


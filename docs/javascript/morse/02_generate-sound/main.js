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

const inputText = document.querySelector('#js_morse_input');
const outputText2Num = document.querySelector('#js_morse_output__num');
const outputText2Code = document.querySelector('#js_morse_output__code');
const btnSubmit = document.querySelector('#js_morse_submit');

const selWave = document.querySelector('#js_wave');
const inputDuration = document.querySelector('#js_duration');

btnSubmit.addEventListener('click', ()=> {
  const num = convText2Num(inputText.value);
  outputText2Num.textContent = num;
  const code = convText2Morse(inputText.value);
  outputText2Code.textContent = code;
  generateMorseSound(num, selWave.value, parseInt(inputDuration.value));
})


const AudioContext = window.AudioContext || window.webkitAudioContext;
if (AudioContext === undefined){
	// AudioContext 未対応
} else {
	const audioContext = new AudioContext();

	function generateMorseSound(code='10101011101110111010101', inputType='sine', inputDuration = 50){
		const oscillator = audioContext.createOscillator();
		const gain = audioContext.createGain();

		// oscillatorをgainに接続する
		oscillator.connect(gain);

		// gainをaudioContextの出力に接続する
		gain.connect(audioContext.destination);

		oscillator.type = inputType;
		oscillator.frequency.setValueAtTime(400, audioContext.currentTime);

    const secDuration = inputDuration/1000;
    const timelines = [];

    for (let i = 0; i < code.length; i++) {
      timelines.push([parseInt(code[i]), parseFloat((i * secDuration).toFixed(3))]);
    }
		// クリックノイズ除去のため、最後は無音に
		timelines.push([0, parseFloat((timelines[timelines.length - 1][1] + secDuration).toFixed(3))]);

    for (const [signal, time] of timelines) {
      gain.gain.setValueAtTime(signal, audioContext.currentTime + time);
    }

		// 音の開始
		oscillator.start(audioContext.currentTime);

		// 再生時間（余白を持たせてクリックノイズを防ぐ）
    const msLengthAll = inputDuration * (code.length + 1);

		// 音の停止
		setTimeout(() => {
			oscillator.stop(audioContext.currentTime);
		}, msLengthAll);
	}
}

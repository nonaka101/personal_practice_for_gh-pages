/** '.', '-' を短音長音とした、モールス信号コード */
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

/**
 * 単一の信号を数値化（例：'.-' -> '101110'）
 * 
 * @param {string} strMorse - 単一の信号
 * @returns {string} 信号を数値化したもの
 */
function morseCharToMorseNumChar(strMorse){
	let result = '';
	for (let chr of String(strMorse)) {
		result += String(chr).replace('.', '1').replace('-', '111') + '0';
	}
	return result;
}


/**
 * 単一の信号数値をモールス符号化（例：'10111' -> '.-'）
 * 
 * @param {string} strNum - 単一の信号数値
 * @returns {string} 単一の信号
 */
function morseNumCharToMorseChar(strNum) {
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

/** 後方の '0' をトリムする */
function removeTrailingZeroes(str) {
  for (let i = str.length - 1; i >= 0; i--) {
    if (str[i] !== '0') {
      return str.substring(0, i + 1);
    }
  }
  // 文字列全体が '0' の場合
  return '';
}

/**
 * テキストをモールス符号を数値化したものに変換
 * 
 * @param {string} text
 * @returns {string} モールス信号の数値化したもの（例：'10111010001...'）
 */
function textToMorseNumText(text){
  let result = '';
  let words = text.toLowerCase().split(' ');
  for (const word of words) {
    for (const char of word) {
      if(MORSE_CODE.encode[char] === undefined){
        // 登録外の文字に対する対応
        result += '0';
      } else {
        result += morseCharToMorseNumChar(MORSE_CODE.encode[char]);
      }
      result += '00';
    }
    result += '0000';
  }
  return removeTrailingZeroes(result);
}

/**
 * テキストをモールス符号化
 * 
 * @param {string} text
 * @returns {string} '.', '-' で構成された信号文
 */
function textToMorseText(text){
  let result = '';
  let words = text.toLowerCase().split(' ');
  for (const word of words) {
    for (const char of word) {
      if(MORSE_CODE.encode[char] === undefined) {
        // 登録外の文字に対する対応
        result += 'X';
      } else {
        result += MORSE_CODE.encode[char];
      }
      result += ' ';
    }
    result += '  ';
  }
  return result.trimEnd();
}

/**
 * モールス数値の文章を、テキストに変換
 * 
 * @param {string} strNums - モールス数値（例：'10111010001...'）
 * @returns {string} テキスト文
 */
function morseNumTextToText(strNums){
  let result = ``;
  let words = strNums.split('0000000');
  for (const word of words){
    let chars = word.split('000');
    for (const char of chars){
      if(MORSE_CODE.decode[morseNumCharToMorseChar(char)] === undefined){
        // 登録外の文字に対する対応
        result += 'X';
      } else {
        result += MORSE_CODE.decode[morseNumCharToMorseChar(char)];
      }
    }
    result += ' ';
  }
  return result;
}

/**
 * モールス信号文を、テキストに変換
 * 
 * @param {string} strNums - モールス文（例：'.- -.-  ---...'）
 * @returns {string} テキスト文
 */
function morseTextToText(strCode){
  let result = ``;
  let words = strCode.split('   ');
  for (const word of words){
    let chars = word.split(' ');
    for (const char of chars){
      if(MORSE_CODE.decode[char] === undefined){
        // 登録外の文字に対する対応
        result += 'X';
      } else {
        result += MORSE_CODE.decode[char];
      }
    }
    result += ' ';
  }
  return result;
}


const AudioContext = window.AudioContext || window.webkitAudioContext;
if (AudioContext === undefined){
	// AudioContext 未対応
} else {
	const audioContext = new AudioContext();

  /**
   * 
   * @param {string} text - モールス信号化するテキスト
   * @param {string} inputType - 波形 [sine, square, saw-tooth, triangle]
   * @param {integer} inputDuration - 短音の間隔（ms）
   */
	function generateMorseSound(text='hello', inputType='sine', inputDuration = 50){
    /**
     * テキストをモールス数値に変換したもの（例：'1010111000101110001'）
     * @type {string}
     */
    const code = textToMorseNumText(text);

    // オシレーター等の設定
		const oscillator = audioContext.createOscillator();
		const gain = audioContext.createGain();
		oscillator.connect(gain);
		gain.connect(audioContext.destination);
		oscillator.type = inputType;
		oscillator.frequency.setValueAtTime(400, audioContext.currentTime);

    /* タイムライン（◯秒のタイミングで、信号が0か1か）の生成
     *   code にあるデータ量の分だけ用意する。
     *   code 分の終了後は、信号を 0 にする（後述するクリックノイズ対策） */
    const secDuration = inputDuration/1000; // 秒単位に換算
    const timelines = [];
    for (let i = 0; i < code.length; i++) {
      timelines.push([parseInt(code[i]), parseFloat((i * secDuration).toFixed(3))]);
    }
		timelines.push([0, parseFloat((timelines[timelines.length - 1][1] + secDuration).toFixed(3))]);
 
    // タイムラインを基に、ゲインをコントロール（ゲインを0と1にすることで信号を表現）
    // TODO: '+' とか特定の場合でエラーが起きる、どうやら setValueAtTime に数値でなく文字列が渡されてるっぽい
    for (const [signal, time] of timelines) {
      gain.gain.setValueAtTime(signal, audioContext.currentTime + time);
    }

		// 再生時間（後方の余白を持たせてクリックノイズを防ぐ）
    const msLengthAll = inputDuration * (code.length + 1);

		// 音の開始・停止
		oscillator.start(audioContext.currentTime);
		setTimeout(() => {
			oscillator.stop(audioContext.currentTime);
		}, msLengthAll);
	}
}


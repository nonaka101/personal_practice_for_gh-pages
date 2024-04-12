const freqA = document.querySelector('#frequency-a');
const freqB = document.querySelector('#frequency-b');
const wave = document.querySelector('#wave');
const lengthAll = document.querySelector('#length');
const ptnRate = document.querySelector('#pattern-rate');
const lengthSpace = document.querySelector('#space');

const btnPlayOnce = document.querySelector('#btnPlayOnce');
const btnPlayLoop = document.querySelector('#btnPlayLoop');
btnPlayOnce.addEventListener('click', () => {
	let options = {};
	options.wave = wave.value;	// sine, square, sawtooth, triangle
	options.freqA = parseInt(freqA.value);
	options.freqB = parseInt(freqB.value);

	options.lengthAll = parseInt(lengthAll.value);
	options.ptnRate= parseInt(ptnRate.value);	// 100 - 10 パターンAの割り合い
	options.lengthSpace= parseInt(lengthSpace.value);	// 0 - 90 空白の割り合い
	beepOnce(options);
})


const AudioContext = window.AudioContext || window.webkitAudioContext;
if (AudioContext === undefined){
	// AudioContext 未対応
} else {
	const audioContext = new AudioContext();

	function beep(inputType='sine', inputFrequency = 400, inputDuration = 50){
		const oscillator = audioContext.createOscillator();
		const gain = audioContext.createGain();

		// oscillatorをgainに接続する
		oscillator.connect(gain);

		// gainをaudioContextの出力に接続する
		gain.connect(audioContext.destination);

		oscillator.type = inputType;
		oscillator.frequency.setValueAtTime(inputFrequency, audioContext.currentTime);
		gain.gain.setValueAtTime(0.5, audioContext.currentTime);

		// ビープ音の開始
		oscillator.start(audioContext.currentTime);

		// ビープ音の停止
		setTimeout(() => {
			oscillator.stop(audioContext.currentTime);
		}, inputDuration);
	}

	function beepOnce(options){
		const oscillator = audioContext.createOscillator();
		const gain = audioContext.createGain();
		oscillator.connect(gain);
		gain.connect(audioContext.destination);
		oscillator.type = options.type;
		gain.gain.value = 1;
		oscillator.frequency.setValueAtTime(options.freqA, audioContext.currentTime);
		oscillator.frequency.setValueAtTime(options.freqB, audioContext.currentTime + options.timeB);



		oscillator.start(audioContext.currentTime);
		oscillator.stop(audioContext.currentTime + time);  // Stop Timing
	}
}

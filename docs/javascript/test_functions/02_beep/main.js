
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

function beep(){
	const oscillator = audioContext.createOscillator();
	const gain = audioContext.createGain();

	// oscillatorをgainに接続する
	oscillator.connect(gain);

	// gainをaudioContextの出力に接続する
	gain.connect(audioContext.destination);

	// サイン波440Hz、音量50%
	oscillator.type = 'sine';
	oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
	gain.gain.setValueAtTime(0.5, audioContext.currentTime);

	// ビープ音の開始
	oscillator.start(audioContext.currentTime);

	// ビープ音の停止
	setTimeout(() => {
		oscillator.stop(audioContext.currentTime);
	}, 100);

}

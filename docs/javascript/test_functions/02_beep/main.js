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
		gain.gain.setValueAtTime(1, audioContext.currentTime);

		// ビープ音の開始
		oscillator.start(audioContext.currentTime);

		// ビープ音の停止
		setTimeout(() => {
			oscillator.stop(audioContext.currentTime);
		}, inputDuration);
	}
}

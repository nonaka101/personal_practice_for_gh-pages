// canvas要素を取得
const canvas = document.getElementById('visualizer');
const canvasCtx = canvas.getContext('2d');

const AudioContext = window.AudioContext || window.webkitAudioContext;
// audio要素を取得
const audioElement = document.getElementById('js_wav_sine');
const audioCtx = new AudioContext();
const audioSource = audioCtx.createMediaElementSource(audioElement);

// 解析用のAnalyserNodeを作成
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// AudioNodeの接続
audioSource.connect(analyser);
audioSource.connect(audioCtx.destination);

// 波形を描画する関数
function draw() {
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.fillStyle = 'rgb(200, 200, 200)';
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

  canvasCtx.beginPath();

  const sliceWidth = WIDTH * 1.0 / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = v * HEIGHT / 2;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
}

// 描画の開始
audioElement.addEventListener('canplay', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
});

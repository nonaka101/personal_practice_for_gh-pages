const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
const source = new AudioBufferSourceNode(audioContext);
const analyser = audioContext.createAnalyser();

analyser.fftSize = 2048;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);

// Connect the source to be analysed
source.connect(analyser);

// Get a canvas defined with ID "oscilloscope"
const canvas = document.getElementById("oscilloscope");
const canvasCtx = canvas.getContext("2d");

// draw an oscilloscope of the current audio source

function draw() {
  requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(dataArray);

  canvasCtx.fillStyle = "rgb(200, 200, 200)";
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = "rgb(0, 0, 0)";

  canvasCtx.beginPath();

  const sliceWidth = (canvas.width * 1.0) / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * canvas.height) / 2;

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

draw();

fetch(`../00_assets/sound/hallo_there__sine400freq44100hz16bit2ch.wav`)
  .then((response) => {
    return response.arrayBuffer();
  })
  .then((arrayBuffer) => {
    const successCallback = (audioBuffer) => {
      // Create instance of `AudioBufferSourceNode`
      console.log(audioBuffer);
      const sRate = audioBuffer.sampleRate;
      const ch = audioBuffer.numberOfChannels;
      const duration = audioBuffer.duration;
      const dataLength = audioBuffer.length;
      console.log(sRate, ch, duration, dataLength);
      console.dir(audioBuffer);
      console.table(audioBuffer);
      console.log(audioBuffer);
    };

    const errorCallback = (error) => {
      // error handling
    };

    audioContext.decodeAudioData(arrayBuffer, successCallback, errorCallback);
  })
  .catch((error) => {
    // error handling
  }
);


/*
const filePath = '../00_assets/sound/'; // 読み込むファイルのパス

// ファイルオブジェクトを作成
const file = new File([filePath], 'hallo_there__sine400freq44100hz16bit2ch.wav');

// FileReaderオブジェクトを作成
const reader = new FileReader();

// 読み込み完了時の処理
reader.onload = (event) => {
  const arrayBuffer = event.target.result; // 読み込んだファイルの内容をArrayBufferとして取得

  // ArrayBufferをAudioBufferに変換
  audioContext.decodeAudioData(arrayBuffer).then((audioBuffer) => {
    // 読み込んだAudioBufferを処理
    processAudioBuffer(audioBuffer);
  }).catch((error) => {
    console.error('Error decoding audio file:', error);
  });
};

// 読み込み処理を開始
reader.readAsArrayBuffer(file);

// 読み込んだAudioBufferを処理する関数
function processAudioBuffer(audioBuffer) {
  // 処理内容 (例: 再生、周波数分析など)
  console.log('AudioBuffer loaded:', audioBuffer);
}

/*
function readWavFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(event) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContext.decodeAudioData(event.target.result, (buffer) => {
        resolve(buffer);
      }, (error) => {
        reject(error);
      });
    };
    reader.onerror = function(error) {
        reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
}
// サンプリング数変換関数
function resampleBuffer(audioBuffer, targetSampleRate) {
  const channels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length * targetSampleRate / audioBuffer.sampleRate;
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const newBuffer = context.createBuffer(channels, length, targetSampleRate);
  for (let channel = 0; channel < channels; channel++) {
    const channelData = newBuffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      const sourceSample = i * audioBuffer.sampleRate / targetSampleRate;
      const roundedSourceSample = Math.round(sourceSample);
      channelData[i] = audioBuffer.getChannelData(channel)[roundedSourceSample];
    }
  }
  return newBuffer;
}
const file = new File(["foo"], '../00_assets/sound/hallo_there__sine400freq44100hz16bit2ch.wav', {
  type: "audio/wav",
});
console.log(file);
try {
  const audioBuffer = await readWavFile(file);
  const resampledBuffer = resampleBuffer(audioBuffer, 22050);
  // resampledBufferを使用して何かを行うことができます
} catch (error) {
  console.error('Error reading or resampling WAV file:', error);
}
*/

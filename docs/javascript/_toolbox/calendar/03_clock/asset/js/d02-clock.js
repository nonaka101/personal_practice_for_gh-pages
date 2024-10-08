
function getTimeString(now = new Date()){
	const hours = String(now.getHours()).padStart(2, "0");
	const minutes = String(now.getMinutes()).padStart(2, "0");
	return `${hours}:${minutes}`;
}

function getDateString(now = new Date()){
	const year = String(now.getFullYear()).padStart(4, "0");
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	const weekArray = ['日', '月', '火', '水', '木', '金', '土'];
	const weekday = weekArray[now.getDay()];
	return `${year}年 ${month}月${day}日（${weekday}）`;
}
const d02_dateDisplay = document.querySelector('#d02js_date');
const d02_timeDisplay = document.querySelector('#d02js_time')
function refreshDateTime() {
	d02_dateDisplay.textContent = getDateString();
	d02_timeDisplay.textContent = getTimeString();
}

const d02_dialogEle = document.querySelector("#d02js_dialog_clock");
let d02_intervalId;

// MutationObserverでdialog要素の属性の変化を監視
const d02_observer = new MutationObserver((mutationsList) => {
	for (const mutation of mutationsList){
		if (mutation.type === 'attributes' && mutation.attributeName === 'open') {
			if (d02_dialogEle.open) {
				// ダイアログが開いた場合
				refreshDateTime();
				d02_intervalId = setInterval(refreshDateTime, 10000);
			} else {
				// ダイアログが閉じた場合
				clearInterval(d02_intervalId);
			}
		}
	}
});

// open属性の変化を監視
d02_observer.observe(d02_dialogEle, {
	attributes: true,
	attributeFilter: ["open"],
});


const d02_output = document.querySelector('#d02js_output');

if (!'speechSynthesis' in window) alert("WebSpeechAPI is not supported by this browser.");
const speechBtn = document.querySelector("#d02js_speechBtn");
speechBtn.addEventListener('click', () => {
	const txt = `${getDateString()} ${getTimeString()}`

	// サウンドモードがOFF（未対応または機能にチェックしていない）の場合は鳴らさない
	if ((chkEnableSound.checked === false)||(isEnabledSound === false)) {
		// サウンドモードがOFFの場合
		const noticeSpan = document.createElement('span');
		noticeSpan.textContent = txt;
		d02_output.appendChild(noticeSpan);
		setTimeout(()=>{
			d02_output.removeChild(noticeSpan);
		}, 1000);	// 読み上げ全体を待たずに消しても、全て読み上げてくれるっぽい
	} else {
		const synth = window.speechSynthesis;
		if(synth) {
			const utterThis = new SpeechSynthesisUtterance(txt);
			synth.speak(utterThis);
		}
	}
});

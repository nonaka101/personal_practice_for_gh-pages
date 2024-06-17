// 各種要素の取得
const btnTextCounter = document.querySelector('#js_btn_textCounter');
const dialogTextCounter = document.querySelector('#js_dialog_textCounter');

// ボタン押下時、ダイアログをモーダル状態で表示
btnTextCounter.addEventListener('click', () => {
	dialogTextCounter.showModal();
});

// ダイアログを閉じる（ダイアログ内 buttonタグの `onClick` イベントに使用）
function closeDialogTextCounter(){
	dialogTextCounter.close();
};

// モーダルダイアログ外をクリック時、ダイアログを閉じる
dialogTextCounter.addEventListener('click', (e) => {
	if(e.target === dialogTextCounter){
		dialogTextCounter.close();
	}
});

// textarea
const textCounterTextArea = document.querySelector('#js_textCounter_inputArea');

// paste from clipboard
const btnTextCounterPasteFromClipboard = document.querySelector('#js_textCounter_pasteFromClipboard');
btnTextCounterPasteFromClipboard.addEventListener('click', () =>{
	navigator.clipboard
  .readText()
  .then((clipText) => {
		/* innerText と value の扱いは違う（InnerTextだと、改行コードが <br> に変換された状態に？）
		console.log(clipText.search(/\n/msu));
		*/
		textCounterTextArea.value = '';
		textCounterTextArea.value = clipText;
	})
	.catch(e => {
		console.error(e);
	});
})

// calculate text count
const textCounterOutput = document.querySelector('#bl_textCounter_output');
const textCounterCountBtn = document.querySelector('#js_textCounter_countBtn');
textCounterCountBtn.addEventListener('click', ()=>{
	const txt = textCounterTextArea.value;
	// Array.from を使った手法
	const charCount = Array.from(txt).length;
	const charCount2 = [...txt.matchAll(/[\s\S]/g)].length;
	const charCount3 = [...new Intl.Segmenter('ja', {granularity: 'grapheme'}).segment(txt)].length;
	textCounterOutput.innerText = `Array.from -> ${charCount} / 正規表現 -> ${charCount2} / Intl.Segmenter -> ${charCount3}`
})

// TODO: Aあ🍎𩸽🏴󠁧󠁢󠁥󠁮󠁧󠁿🇯🇵👨🏻‍💻 -> 7 になるように
// 現状、Array.from だと17、正規表現だと 31 になる
// -> Intl.Segmenter の手法で解決しそう、英語もごっちゃにした文を試してみたけど、`ja` で通った。

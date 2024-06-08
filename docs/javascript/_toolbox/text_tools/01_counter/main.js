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

const textCounterTextArea = document.querySelector('#js_textCounter_inputArea');

const btnTextCounterPasteFromClipboard = document.querySelector('#js_textCounter_pasteFromClipboard');
btnTextCounterPasteFromClipboard.addEventListener('click', () =>{
	navigator.clipboard
  .readText()
  .then((clipText) => {
		textCounterTextArea.innerText = '';
		textCounterTextArea.innerText = clipText;
	});
})


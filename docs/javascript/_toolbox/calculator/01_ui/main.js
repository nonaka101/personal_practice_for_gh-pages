/* ≡≡≡ ▀▄ 「メニュー」ボタン ▀▄ ≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
	■ 概要
		モバイル画面時、ヘッダーにある「メニュー」ボタンを押すと、モーダルダイアログを表示
	■ 備考
		`showModal()` を使っているため、HTML側で autofocus 属性は不要
		（フォーカスは、自動で近くのフォーカス可能な要素に移るため「閉じる」ボタンが選択される）
---------------------------------------------------------------------------- */

// 各種要素の取得
const menuBtn = document.getElementById('js_btn_calc');
const menuDialog = document.getElementById('menu');

// ボタン押下時、ダイアログをモーダル状態で表示
menuBtn.addEventListener('click', () => {
	menuDialog.showModal();
});

// ダイアログを閉じる（ダイアログ内 buttonタグの `onClick` イベントに使用）
function closeDialog(){
	menuDialog.close();
};

// モーダルダイアログ外をクリック時、ダイアログを閉じる
menuDialog.addEventListener('click', (e) => {
	if(e.target === menuDialog){
		menuDialog.close();
	}
});
function chooseRandomChar(){

}

const c04_btnCalc = document.querySelector('#c04js_calcBtn');
const c04_output = document.querySelector('#c04js_output');

c04_btnCalc.addEventListener('click', () =>{
	const alphabetsLower = 'abcdefghijklmnopqrstuvwxyz';
	const alphabetsUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const digits = '0123456789';

	// TODO: エスケープ処理、シンボルをいくつかに分割
	const symbols1 = '-';
	const symbols2 = String.raw`\`~!_@#$%^&*()_+={}[]\\|:;"'<>,.?/`;

	// TODO: 強度に応じて、いくつかに分割？
	const confuzingChars = 'oO0l17zZ2b6g9cCkKpPsSuUvVwWxXyY';
	const difficultOrallyChars = '(){}[]<>';

	/**
	 * 1. 上記パターンから使うものを取捨選択
	 * 	 - 使用するパターンを設定
	 * 	 - パターン内の特定の文字列（紛らわしい、伝えづらい）を除去する処理？
	 * 2. 文字列の長さ、小文字の頻度パラメータに応じて、各パターンに使用回数を振り分ける
	 * 3. 各パターンからランダムに取得した文字を集め、ランダムソートして完了
	 */
});

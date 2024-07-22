const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

function findNullIndices(arr) {
	let indices = [];
	arr.forEach((element, index) => {
			if (element === null) {
					indices.push(index);
			}
	});
	return indices;
}

/**
 * テーブルスタイルを enum 風に管理
 */
const TABLE_STYLE = Object.freeze({
	none: 0,							// ベース
	horizontal: 1,				// 水平（行方向に重きを置く表）
	vertical: 2,					// 垂直（列方向に重きを置く表）
	cross: 3,							// クロス（行列組み合わせた表）
	noneWide: 4,					// ベース＋ワイド（列数が多めで、横方向へスクロールするスタイルの幅が広め）
	horizontalWide: 5,
	verticalWide: 6,
	crossWide: 7,
	noneWideEx: 8,				// ベース＋EXワイド（列数が更に多く、ワイドよりも更に広め）
	horizontalWideEx: 9,
	verticalWideEx: 10,
	crossWideEx: 11,
});

function createTable(dataArray, tableStyle=0) {
	const styleWidth = Math.floor(tableStyle / 4);
	const styleDirection = tableStyle % 4;

	// テーブルのラップ要素 div の生成
	const tableWrapper = document.createElement('div');
	let classes = ['bl_table'];
	switch (styleDirection) {
		case 0:
			break;
		case 1:
			classes.push('bl_table__horizontal');
			break;
		case 2:
			classes.push('bl_table__vertical');
			break;
		case 3:
			classes.push('bl_table__cross');
			break;
	}
	switch (styleWidth) {
		case 0:
			break;
		case 1:
			classes.push('bl_table__wide');
			break;
		case 2:
			classes.push('bl_table__exWide');
			break;
	}
	tableWrapper.classList.add(...classes);

	const table = document.createElement('table');
	tableWrapper.appendChild(table);

	// ヘッダー部を作成
	const tableHeaderRow = table.createTHead().insertRow();
	const arrayHeader = dataArray.shift();
	let isFirstCell = true;	// クロス表の表側頭で scope をつけないためのもの
	for(const cell of arrayHeader){
		const th = document.createElement('th');
		th.textContent = cell;

		// 表形式が 垂直 または クロスかつ表側頭セル以外の場合、スコープ付与
		if((styleDirection === 2) || (styleDirection === 3 && isFirstCell === false)) {
			th.scope = 'col';
		}
		tableHeaderRow.appendChild(th);
		isFirstCell = false;
	}

	// ボディ部を作成
	const tableBody = table.createTBody();
	for (const arrayRow of dataArray) {
		const row = tableBody.insertRow();

		// 初回のみ th 要素
		const thCell = arrayRow.shift();
		const th = document.createElement('th');
		th.textContent = thCell;
		if(styleDirection === 1 || styleDirection === 3) {
			th.scope = 'row';
		}
		row.appendChild(th);

		// 2列目以降は td 要素
		for(const tdCell of arrayRow){
			const cell = row.insertCell();
			cell.textContent = tdCell;
		}
	}

	// テーブル要素を格納した div.bl_table 要素を返す
	return tableWrapper;
}

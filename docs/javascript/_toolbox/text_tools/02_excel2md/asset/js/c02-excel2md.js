function excel2Markdown(excelStr) {
  // 改行コードを \n に統一
  const normalizedStr = excelStr.replace(/\r\n/g, '\n');

	// 行→列の順で、配列に分割
	const rows = normalizedStr.trim().split('\n');
	const table = rows.map(row => row.split('\t'));

	// 列数から、Markdown のセパレータ文字列を生成
	const numColumns = table[0].length;
	const separateStr = `| ${Array(numColumns).fill('---').join(" | ")} |`;

	// 配列形式の列はもう不要なので、`|` で分割した文字列に再統合
	let result = [];
	for (let i = 1; i < table.length; i++) {
		result.push(`| ${table[i].join(" | ")} |`);
	}

	// セパレータを2行目に挿入後、配列を改行文字列で繋げて返す
	result.splice(1, 0, separateStr);
	return result.join('\n');
}

// 例:
const excelStr = `Header1\tHeader2\tHeader3
Data1-1\tData1-2\tData1-3
Data2-1\tData2-2\tData2-3`;

console.log(excel2Markdown(excelStr));

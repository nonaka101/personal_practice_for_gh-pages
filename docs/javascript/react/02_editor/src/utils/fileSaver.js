export function saveAsMarkdown(markdownContent, title) {
	// ファイル名を生成（スペースや特殊文字を置換）
	const filename = `${title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_') || 'document'}.md`;

	const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = filename;

	document.body.appendChild(link); // Firefoxで必要
	link.click();

	document.body.removeChild(link); // 後片付け
	URL.revokeObjectURL(url); // メモリ解放
}

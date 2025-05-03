export function saveAsMarkdown(markdownContent, title) {
	// コンテンツの生成
	const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
	const url = URL.createObjectURL(blob);

	// ダウンロード用リンクを作成
	const filename = `${title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_') || 'document'}.md`;
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;

	// リンクを一時的にDOMに追加（Firefox用）し、イベント発火でダウンロードを開始
	document.body.appendChild(link);
	link.click();

	// 不要となったリンクを削除（オブジェクトの開放含む）
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

import React, { forwardRef } from 'react'; // forwardRef をインポート

const blockTypes = [
	{ type: 'heading', label: '見出し (H2)' },
	{ type: 'paragraph', label: '文章' },
	{ type: 'blockquote', label: '引用' },
	{ type: 'orderedList', label: '順序付きリスト' },
	{ type: 'unorderedList', label: '順序なしリスト' },
	{ type: 'horizontalRule', label: '区切り線' },
	{ type: 'code', label: 'コードブロック' },
];

// forwardRef を使って親コンポーネントから ref を受け取る
const AddBlockDialog = forwardRef(({ onSelect }, ref) => {

	const handleSelect = (type) => {
		onSelect(type);
		if (ref.current) {
			ref.current.close(); // ダイアログを閉じる
		}
	};

	const handleClose = () => {
		if (ref.current) {
			ref.current.close(); // キャンセル時も閉じる
		}
	}

	// dialog 要素に ref を設定
	return (
		<dialog ref={ref} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
			<h3>追加するブロックを選択</h3>
			<ul style={{ listStyle: 'none', padding: 0 }}>
				{blockTypes.map(block => (
					<li key={block.type} style={{ marginBottom: '8px' }}>
						<button onClick={() => handleSelect(block.type)} style={{ width: '100%', textAlign: 'left', padding: '5px' }}>
							{block.label}
						</button>
					</li>
				))}
			</ul>
			{/* 閉じるボタン（dialog要素はform[method="dialog"]でも閉じれる） */}
			<form method="dialog" style={{ marginTop: '10px', textAlign: 'right' }}>
				<button type="submit">キャンセル</button> {/* type="submit" でも dialog を閉じる */}
				{/* <button type="button" onClick={handleClose}>キャンセル</button> */}
			</form>
		</dialog>
	);
});

export default AddBlockDialog;

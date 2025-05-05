import React, { forwardRef } from 'react';
import './AddBlockDialog.css';

const blockTypes = [
	{ type: 'heading', label: '見出し (H2)' },
	{ type: 'paragraph', label: '文章' },
	{ type: 'blockquote', label: '引用' },
	{ type: 'orderedList', label: '順序付きリスト' },
	{ type: 'unorderedList', label: '順序なしリスト' },
	{ type: 'horizontalRule', label: '区切り線' },
	{ type: 'code', label: 'コード' },
];

// 親コンポーネントから ref を受け取る
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
		<dialog ref={ref}  className='block-dialog'>
			<div className='block-dialog-body'>
				<h2 className='block-dialog-title'>追加するブロックを選択</h2>
				<ul className='block-dialog-list'>
					{blockTypes.map(block => (
						<li key={block.type} style={{ marginBottom: '8px' }}>
							<button onClick={() => handleSelect(block.type)} className='block-dialog-item'>
								{block.label}
							</button>
						</li>
					))}
				</ul>
				<button className='block-dialog-cancel' type="button" onClick={handleClose}>キャンセル</button>
			</div>
		</dialog>
	);
});

export default AddBlockDialog;

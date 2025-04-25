import React from 'react';
import './AddBlockDialog.css'; // CSSをインポート

const blockTypes = [
  { type: 'heading', label: '見出し (H2)', svg: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" role="graphics-symbol img" aria-hidden="true"><rect x="4" y="20" width="40" height="8"></rect><rect x="20" y="4" width="8" height="40"></rect></svg>` },
  { type: 'paragraph', label: '文章', svg: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" role="graphics-symbol img" aria-hidden="true"><rect x="4" y="20" width="40" height="8"></rect><rect x="20" y="4" width="8" height="40"></rect></svg>`},
  { type: 'blockquote', label: '引用',  svg: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" role="graphics-symbol img" aria-hidden="true"><rect x="4" y="20" width="40" height="8"></rect><rect x="20" y="4" width="8" height="40"></rect></svg>`},
  { type: 'orderedList', label: '順序付きリスト',  svg: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" role="graphics-symbol img" aria-hidden="true"><rect x="4" y="20" width="40" height="8"></rect><rect x="20" y="4" width="8" height="40"></rect></svg>` },
  { type: 'unorderedList', label: '順序なしリスト',  svg: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" role="graphics-symbol img" aria-hidden="true"><rect x="4" y="20" width="40" height="8"></rect><rect x="20" y="4" width="8" height="40"></rect></svg>` },
  { type: 'horizontalRule', label: '区切り線',  svg: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" role="graphics-symbol img" aria-hidden="true"><rect x="4" y="20" width="40" height="8"></rect><rect x="20" y="4" width="8" height="40"></rect></svg>` },
  { type: 'code', label: 'コードブロック',  svg: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" role="graphics-symbol img" aria-hidden="true"><rect x="4" y="20" width="40" height="8"></rect><rect x="20" y="4" width="8" height="40"></rect></svg>` },
];

// 簡単なモーダル実装例
function AddBlockDialog({ onSelect, onClose }) {
  return (
    <dialog open className='cp_dialog'>
			<div className='cp_dialog_body'>
				<h3>追加するブロックを選択</h3>
				<ul className='cp_dialog_list'>
					{blockTypes.map(block => (
						<li key={block.type} className='cp_dialog_item'>
							<button onClick={() => onSelect(block.type)} className='bl_iconButton'>
								<div dangerouslySetInnerHTML={{ __html: block.svg }}></div>
								{block.label}
							</button>
						</li>
					))}
				</ul>
				<button className='el_btn el_btn__primary' onClick={onClose}>キャンセル</button>
			</div>
    </dialog>
  );
}

export default AddBlockDialog;

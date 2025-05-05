import React, { useRef, useEffect } from 'react';
import './ListItem.css';

function ListItem({ item, index, blockId, isFocused, onClearFocusedItem, onUpdate, onDelete, onMoveUp, onMoveDown, onAddItemBelow }) {
	const inputRef = useRef(null); // input 要素への参照

	// フォーカス処理
	useEffect(() => {
		if (isFocused && inputRef.current) {
			inputRef.current.focus();
			// フォーカスを当てたら、Appコンポーネントに通知してフォーカス状態をクリア
			onClearFocusedItem();
		}
	}, [isFocused, onClearFocusedItem]); // isFocused が変更されたときのみ実行


	const handleInputChange = (event) => {
		onUpdate(event.target.value);
	};

	const handleKeyDown = (event) => {
		// Enterキーで新しいアイテムを追加
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			onAddItemBelow(); // 新しいアイテムを追加するコールバックを呼び出す
		}
		// Backspaceキーで空のアイテムを削除
		else if (event.key === 'Backspace' && item.content === '') {
			event.preventDefault();
			onDelete();
		}
	};

	return (
		<li className='list-item'>
			<input
				className='list-item-input'
				ref={inputRef} // input 要素に ref を設定
				type="text"
				value={item.content}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown} // キー入力イベントを監視
				placeholder="リスト項目"
			/>
			{/* アイテム操作ボタン */}
			<div className='list-item-buttons'>
				<button className='list-item-button list-item-button-secondary' onClick={onMoveUp}>↑</button>
				<button className='list-item-button list-item-button-secondary' onClick={onMoveDown}>↓</button>
				<button className='list-item-button list-item-button-secondary' onClick={onDelete}>削除</button>
				<button className='list-item-button list-item-button-primary' onClick={onAddItemBelow}>挿入</button>
			</div>
		</li>
	);
}

export default ListItem;

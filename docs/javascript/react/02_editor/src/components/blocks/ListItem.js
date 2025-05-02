import React, { useRef, useEffect } from 'react'; // useRef, useEffect を追加

function ListItem({ item, index, blockId, isFocused, onClearFocusedItem, onUpdate, onDelete, onMoveUp, onMoveDown, onAddItemBelow }) {
	const inputRef = useRef(null); // input 要素への参照

	// フォーカス処理
	useEffect(() => {
		if (isFocused && inputRef.current) {
			inputRef.current.focus();
			// フォーカスを当てたら、Appコンポーネントに通知してフォーカス状態をクリア
			onClearFocusedItem();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
			// ここで前のアイテムにフォーカスを移す処理も追加できる
		}
		// 上下キーでアイテム間を移動する（より高度な機能）
		/*
		else if (event.key === 'ArrowUp') {
				// Move focus to previous item or block control
		} else if (event.key === 'ArrowDown') {
				// Move focus to next item or block control
		}
		*/
	};

	return (
		<li style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
			<input
				ref={inputRef} // input 要素に ref を設定
				type="text"
				value={item.content}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown} // キー入力イベントを監視
				placeholder="リスト項目"
				style={{ flexGrow: 1, marginRight: '5px' }}
			/>
			{/* アイテム操作ボタン */}
			<button onClick={onMoveUp} title="Move Up" style={{ fontSize: '0.8em' }}>↑</button>
			<button onClick={onMoveDown} title="Move Down" style={{ fontSize: '0.8em' }}>↓</button>
			<button onClick={onDelete} title="Delete Item" style={{ color: 'red', fontSize: '0.8em' }}>X</button>
			{/* <button onClick={onAddItemBelow} title="Add Item Below" style={{ fontSize: '0.8em' }}>+</button> */}
		</li>
	);
}

export default ListItem;

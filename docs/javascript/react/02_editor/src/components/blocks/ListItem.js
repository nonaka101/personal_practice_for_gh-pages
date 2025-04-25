import React from 'react';

function ListItem({ item, index, blockId, onUpdate, onDelete, onMoveUp, onMoveDown, onAddItemBelow }) {
  const handleInputChange = (event) => {
    onUpdate(event.target.value);
  };

  // Enterキーで新しいアイテムを追加する処理（例）
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // デフォルトの改行を防ぐ
      onAddItemBelow(); // 親コンポーネントに通知して新しいアイテムを追加
    }
     // Backspaceキーで空のアイテムを削除する処理（例）
    if (event.key === 'Backspace' && item.content === '') {
        event.preventDefault();
        onDelete();
    }
  };

  return (
    <li style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
      <input
        type="text"
        value={item.content}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // Enter / Backspace キー処理
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

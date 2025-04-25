import React from 'react';
import ListItem from './ListItem'; // ListItem コンポーネントをインポート

function ListBlock({ block, onAddListItem, onUpdateListItem, onDeleteListItem, onMoveListItem }) {
  const Tag = block.type === 'orderedList' ? 'ol' : 'ul';

  const handleAddItem = (index) => {
    onAddListItem(block.id, index);
  };

  return (
    <Tag style={{ paddingLeft: '20px' }}>
      {block.items.map((item, index) => (
        <ListItem
          key={item.id}
          item={item}
          index={index}
          blockId={block.id}
          onUpdate={(content) => onUpdateListItem(block.id, item.id, content)}
          onDelete={() => onDeleteListItem(block.id, item.id)}
          onMoveUp={() => onMoveListItem(block.id, item.id, 'up')}
          onMoveDown={() => onMoveListItem(block.id, item.id, 'down')}
          onAddItemBelow={() => handleAddItem(index)} // 次のアイテムを追加するボタン
        />
      ))}
       {/* リストの最後に必ず追加ボタンを置く場合 */}
       {/*
       <button onClick={() => handleAddItem(block.items.length - 1)} style={{ marginLeft: '20px' }}>+</button>
       */}
    </Tag>
  );
}

export default ListBlock;

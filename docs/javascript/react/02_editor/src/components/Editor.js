import React from 'react';
import Block from './Block';

function Editor({ blocks, onAddBlock, onUpdateBlock, onDeleteBlock, onMoveBlock, onAddListItem, onUpdateListItem, onDeleteListItem, onMoveListItem }) {
  return (
    <div>
      {blocks.map((block, index) => (
        <Block
          key={block.id}
          block={block}
          index={index} // ブロック追加のために index が必要
          onAddBlock={onAddBlock}
          onUpdateBlock={onUpdateBlock}
          onDeleteBlock={onDeleteBlock}
          onMoveBlock={onMoveBlock}
          // リスト項目操作関数を Block -> ListBlock へ渡す
          onAddListItem={onAddListItem}
          onUpdateListItem={onUpdateListItem}
          onDeleteListItem={onDeleteListItem}
          onMoveListItem={onMoveListItem}
        />
      ))}
      {/* 最後に一つ追加ボタンを置く場合（各ブロック下にもある想定） */}
      {/* <AddBlockButton index={blocks.length - 1} onAddBlock={onAddBlock} /> */}
    </div>
  );
}

export default Editor;

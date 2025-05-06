import React from 'react';
import Block from './Block';
import './Editor.css';

function Editor({ blocks, focusedItemId, onClearFocusedItem, onAddBlock, onUpdateBlock, onDeleteBlock, onMoveBlock, onAddListItem, onUpdateListItem, onDeleteListItem, onMoveListItem }) {
	// アイテムが0になったリストブロックをフィルタリングする場合
	// const visibleBlocks = blocks.filter(block => !(block.items && block.items.length === 0));
	const visibleBlocks = blocks; // この例ではフィルタリングしない

	return (
		<main className='editor'>
			{visibleBlocks.map((block, index) => (
				<Block
					key={block.id}
					block={block}
					index={index}
					focusedItemId={focusedItemId} // focusedItemId を Block へ渡す
					onClearFocusedItem={onClearFocusedItem} // onClearFocusedItem を Block へ渡す
					onAddBlock={onAddBlock}
					onUpdateBlock={onUpdateBlock}
					onDeleteBlock={onDeleteBlock}
					onMoveBlock={onMoveBlock}
					onAddListItem={onAddListItem}
					onUpdateListItem={onUpdateListItem}
					onDeleteListItem={onDeleteListItem}
					onMoveListItem={onMoveListItem}
				/>
			))}
		</main>
	);
}

export default Editor;

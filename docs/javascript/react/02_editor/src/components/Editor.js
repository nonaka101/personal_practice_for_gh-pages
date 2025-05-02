import React from 'react';
import Block from './Block';

function Editor({ blocks, focusedItemId, onClearFocusedItem, onAddBlock, onUpdateBlock, onDeleteBlock, onMoveBlock, onAddListItem, onUpdateListItem, onDeleteListItem, onMoveListItem }) {
	// アイテムが0になったリストブロックをフィルタリングする場合
	// const visibleBlocks = blocks.filter(block => !(block.items && block.items.length === 0));
	const visibleBlocks = blocks; // この例ではフィルタリングしない

	return (
		<div>
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
			{/* Optional: Add a final 'add block' button at the end */}
			{/* <AddBlockButton index={blocks.length - 1} onAddBlock={onAddBlock} isFinalButton={true} /> */}
		</div>
	);
}

export default Editor;

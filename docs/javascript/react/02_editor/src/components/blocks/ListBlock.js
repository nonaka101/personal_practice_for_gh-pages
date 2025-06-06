import React from 'react';
import ListItem from './ListItem';
import './ListBlock.css';

function ListBlock({ block, focusedItemId, onClearFocusedItem, onAddListItem, onUpdateListItem, onDeleteListItem, onMoveListItem }) {
	const Tag = block.type === 'orderedList' ? 'ol' : 'ul';

	return (
		<React.Fragment>
			<span className='list-block-title'>{Tag === 'ol' ? '順序付きリスト' : '順序なしリスト'}</span>
			<Tag className='list-block'>
				{block.items.map((item, index) => (
					<ListItem
						key={item.id}
						item={item}
						index={index}
						blockId={block.id}
						isFocused={item.id === focusedItemId} // フォーカス対象かどうかを渡す
						onClearFocusedItem={onClearFocusedItem} // フォーカス完了通知関数を渡す
						onUpdate={(content) => onUpdateListItem(block.id, item.id, content)}
						onDelete={() => onDeleteListItem(block.id, item.id)}
						onMoveUp={() => onMoveListItem(block.id, item.id, 'up')}
						onMoveDown={() => onMoveListItem(block.id, item.id, 'down')}
						onAddItemBelow={() => onAddListItem(block.id, index)} // Enter キーで次のアイテムを追加
					/>
				))}
				{/* リスト末尾に常に表示される追加ボタン（オプション） */}
				{/*
				<li style={{listStyle:'none', marginTop:'5px'}}>
						<button onClick={() => onAddListItem(block.id, block.items.length - 1)}>+</button>
				</li>
				*/}
			</Tag>
		</React.Fragment>
	);
}

export default ListBlock;

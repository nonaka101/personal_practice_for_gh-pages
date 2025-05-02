import React, { useRef } from 'react'; // useState を削除し、useRef を追加
import BlockControls from './BlockControls';
import AddBlockButton from './AddBlockButton';
import AddBlockDialog from './AddBlockDialog'; // ダイアログコンポーネント
import HeadingBlock from './blocks/HeadingBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
import BlockquoteBlock from './blocks/BlockquoteBlock';
import ListBlock from './blocks/ListBlock';
import HrBlock from './blocks/HrBlock';
import CodeBlock from './blocks/CodeBlock';

function Block({ block, index, focusedItemId, onClearFocusedItem, onAddBlock, onUpdateBlock, onDeleteBlock, onMoveBlock, onAddListItem, onUpdateListItem, onDeleteListItem, onMoveListItem }) {
	const dialogRef = useRef(null); // dialog 要素への参照

	// --- コンテンツ更新ハンドラ (前回と同様) ---
	const handleContentChange = (newContent) => onUpdateBlock(block.id, { content: newContent });
	const handleLevelChange = (newLevel) => onUpdateBlock(block.id, { level: newLevel });
	const handleLanguageChange = (newLanguage) => onUpdateBlock(block.id, { language: newLanguage });

	// --- ブロックコンテンツのレンダリング ---
	const renderBlockContent = () => {
		switch (block.type) {
			case 'heading':
				return <HeadingBlock content={block.content} level={block.level} onContentChange={handleContentChange} onLevelChange={handleLevelChange} />;
			case 'paragraph':
				return <ParagraphBlock content={block.content} onContentChange={handleContentChange} />;
			case 'blockquote':
				return <BlockquoteBlock content={block.content} onContentChange={handleContentChange} />;
			case 'orderedList':
			case 'unorderedList':
				return <ListBlock
					block={block}
					focusedItemId={focusedItemId} // focusedItemId を ListBlock へ渡す
					onClearFocusedItem={onClearFocusedItem} // onClearFocusedItem を ListBlock へ渡す
					onAddListItem={onAddListItem}
					onUpdateListItem={onUpdateListItem}
					onDeleteListItem={onDeleteListItem}
					onMoveListItem={onMoveListItem}
				/>;
			case 'horizontalRule':
				return <HrBlock />;
			case 'code':
				return <CodeBlock content={block.content} language={block.language} onContentChange={handleContentChange} onLanguageChange={handleLanguageChange} />;
			default:
				return null;
		}
	};

	// --- ダイアログ制御 ---
	const openAddDialog = () => {
		if (dialogRef.current) {
			dialogRef.current.showModal(); // dialog をモーダルで開く
		}
	};

	const handleAddBlockSelect = (type) => {
		onAddBlock(index, type);
		// ダイアログは AddBlockDialog 内部で閉じる (close() を呼ぶ)
	};

	return (
		<div id={`block-${block.id}`} style={{ border: '1px dashed #eee', padding: '10px', marginBottom: '10px', position: 'relative' }}>
			<BlockControls
				blockId={block.id}
				blockType={block.type}
				level={block.level}
				language={block.language} // コードブロックの言語表示/編集用
				onDelete={() => onDeleteBlock(block.id)}
				onMoveUp={() => onMoveBlock(block.id, 'up')}
				onMoveDown={() => onMoveBlock(block.id, 'down')}
				onLevelChange={handleLevelChange}
				onLanguageChange={handleLanguageChange} // 言語変更ハンドラを追加
				showLevelControls={block.type === 'heading'}
				showLanguageInput={block.type === 'code'} // コードブロックの場合に言語入力を表示
			/>
			<div style={{ marginTop: '30px' }}>
				{renderBlockContent()}
			</div>
			{/* ブロック追加ボタン */}
			<AddBlockButton onClick={openAddDialog} />
			{/* ダイアログコンポーネント (常にレンダリングしておくが、表示は showModal で制御) */}
			<AddBlockDialog ref={dialogRef} onSelect={handleAddBlockSelect} />
		</div>
	);
}

export default Block;

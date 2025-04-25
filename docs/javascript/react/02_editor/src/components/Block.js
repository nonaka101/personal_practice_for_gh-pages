import React, { useState } from 'react';
import BlockControls from './BlockControls';
import AddBlockButton from './AddBlockButton';
import HeadingBlock from './blocks/HeadingBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
import BlockquoteBlock from './blocks/BlockquoteBlock';
import ListBlock from './blocks/ListBlock';
import HrBlock from './blocks/HrBlock';
import CodeBlock from './blocks/CodeBlock';
import AddBlockDialog from './AddBlockDialog'; // ダイアログを追加

function Block({ block, index, onAddBlock, onUpdateBlock, onDeleteBlock, onMoveBlock, onAddListItem, onUpdateListItem, onDeleteListItem, onMoveListItem }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleContentChange = (newContent) => {
    onUpdateBlock(block.id, { content: newContent });
  };

  const handleLevelChange = (newLevel) => {
    onUpdateBlock(block.id, { level: newLevel });
  };

  const handleLanguageChange = (newLanguage) => {
    onUpdateBlock(block.id, { language: newLanguage });
  };

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
                  onUpdateBlock={onUpdateBlock} // ListBlock内でアイテム操作を完結させる場合はこれを使う
                  // Appで管理する場合は個別の関数を渡す
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

  const openAddDialog = () => setIsAddDialogOpen(true);
  const closeAddDialog = () => setIsAddDialogOpen(false);

  const handleAddBlock = (type) => {
      onAddBlock(index, type);
      closeAddDialog();
  }

  return (
    <div id={`block-${block.id}`} style={{ border: '1px dashed #eee', padding: '10px', marginBottom: '10px', position: 'relative' }}>
      <BlockControls
        blockId={block.id}
        blockType={block.type} // レベル変更などに使う
        level={block.level} // 見出しレベル
        onDelete={() => onDeleteBlock(block.id)}
        onMoveUp={() => onMoveBlock(block.id, 'up')}
        onMoveDown={() => onMoveBlock(block.id, 'down')}
        onLevelChange={handleLevelChange} // 見出しレベル変更用
        showLevelControls={block.type === 'heading'}
      />
      <div style={{ marginTop: '30px' }}> {/* コントロールと重ならないように */}
        {renderBlockContent()}
      </div>
      {/* 各ブロックの下に追加ボタンを配置 */}
      <AddBlockButton onClick={openAddDialog} />
      {isAddDialogOpen && (
        <AddBlockDialog
          onSelect={handleAddBlock}
          onClose={closeAddDialog}
        />
      )}
    </div>
  );
}

export default Block;

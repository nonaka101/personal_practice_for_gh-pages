import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import GlobalMenu from './components/GlobalMenu';
import Editor from './components/Editor';
import { generateMarkdown } from './utils/markdownGenerator';
import { saveAsMarkdown } from './utils/fileSaver';
import './App.css';

function App() {
  const [title, setTitle] = useState('Untitled Document');
  const [blocks, setBlocks] = useState([
    // 初期ブロック（例）
    { id: uuidv4(), type: 'heading', content: '最初の見出し', level: 2 },
    { id: uuidv4(), type: 'paragraph', content: 'ここに文章を入力します。' },
  ]);

  // --- ブロック操作関数 ---

  const addBlock = useCallback((index, type) => {
    const newBlock = {
      id: uuidv4(),
      type: type,
      content: '',
      level: 2, // heading のデフォルト
      language: '', // code のデフォルト
      items: type === 'orderedList' || type === 'unorderedList' ? [{ id: uuidv4(), content: '' }] : [],
    };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
  }, [blocks]);

  const updateBlock = useCallback((id, updates) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === id ? { ...block, ...updates } : block
      )
    );
  }, []);

  const deleteBlock = useCallback((id) => {
    setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== id));
  }, []);

  const moveBlock = useCallback((id, direction) => {
    setBlocks(prevBlocks => {
      const index = prevBlocks.findIndex(block => block.id === id);
      if (index === -1) return prevBlocks;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prevBlocks.length) return prevBlocks; // 範囲外なら移動しない

      const newBlocks = [...prevBlocks];
      const [movedBlock] = newBlocks.splice(index, 1);
      newBlocks.splice(newIndex, 0, movedBlock);
      return newBlocks;
    });
  }, []);

  // --- リスト項目操作 ---
  // ListBlock コンポーネント内で処理する方が状態管理はシンプルになるが、
  // App で一元管理する場合は以下のような関数を用意する

  const addListItem = useCallback((blockId, itemIndex) => {
      setBlocks(prevBlocks => prevBlocks.map(block => {
          if (block.id === blockId && (block.type === 'orderedList' || block.type === 'unorderedList')) {
              const newItems = [...block.items];
              newItems.splice(itemIndex + 1, 0, { id: uuidv4(), content: '' });
              return { ...block, items: newItems };
          }
          return block;
      }));
  }, []);

  const updateListItem = useCallback((blockId, itemId, content) => {
      setBlocks(prevBlocks => prevBlocks.map(block => {
          if (block.id === blockId && block.items) {
              const newItems = block.items.map(item =>
                  item.id === itemId ? { ...item, content } : item
              );
              return { ...block, items: newItems };
          }
          return block;
      }));
  }, []);

    const deleteListItem = useCallback((blockId, itemId) => {
        setBlocks(prevBlocks => prevBlocks.map(block => {
            if (block.id === blockId && block.items) {
                // 最後のアイテムは削除せず、内容を空にするか、ブロックごと削除するか仕様による
                // ここでは最低1つは残すようにする（または空なら削除）
                if (block.items.length <= 1) {
                    // 最後のアイテムの内容を空にする
                    // return { ...block, items: [{ id: uuidv4(), content: '' }] };
                    // もしくはリストブロック自体を削除するなら別途 deleteBlock を呼ぶ
                    // ここでは単純に削除する
                     const newItems = block.items.filter(item => item.id !== itemId);
                     // もしアイテムが0になったらリストブロック自体を削除する例
                     // if (newItems.length === 0) {
                     //     return null; // Editor側で filter(Boolean) する必要あり
                     // }
                    return { ...block, items: newItems };
                }
                const newItems = block.items.filter(item => item.id !== itemId);
                return { ...block, items: newItems };
            }
            return block;
        })/*.filter(Boolean)*/); // アイテムが0になったブロックを削除する場合
    }, []);

    const moveListItem = useCallback((blockId, itemId, direction) => {
        setBlocks(prevBlocks => prevBlocks.map(block => {
            if (block.id === blockId && block.items) {
                const index = block.items.findIndex(item => item.id === itemId);
                if (index === -1) return block;

                const newIndex = direction === 'up' ? index - 1 : index + 1;
                if (newIndex < 0 || newIndex >= block.items.length) return block;

                const newItems = [...block.items];
                const [movedItem] = newItems.splice(index, 1);
                newItems.splice(newIndex, 0, movedItem);
                return { ...block, items: newItems };
            }
            return block;
        }));
    }, []);


  // --- 書き出し処理 ---

  const handleExportMarkdown = useCallback(() => {
    const markdown = generateMarkdown(title, blocks);
    // クリップボードにコピー
    navigator.clipboard.writeText(markdown)
      .then(() => alert('Markdownをクリップボードにコピーしました'))
      .catch(err => console.error('クリップボードへのコピーに失敗しました:', err));
  }, [title, blocks]);

  const handleSaveMarkdownFile = useCallback(() => {
    const markdown = generateMarkdown(title, blocks);
    saveAsMarkdown(markdown, title);
  }, [title, blocks]);

  return (
    <div>
      <GlobalMenu
        title={title}
        setTitle={setTitle}
        blocks={blocks}
        onExport={handleExportMarkdown}
        onSave={handleSaveMarkdownFile}
      />
      <Editor
        blocks={blocks}
        onAddBlock={addBlock}
        onUpdateBlock={updateBlock}
        onDeleteBlock={deleteBlock}
        onMoveBlock={moveBlock}
        // リスト項目操作関数を渡す
        onAddListItem={addListItem}
        onUpdateListItem={updateListItem}
        onDeleteListItem={deleteListItem}
        onMoveListItem={moveListItem}
      />
    </div>
  );
}

export default App;

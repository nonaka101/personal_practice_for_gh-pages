import React from 'react';

const blockTypes = [
  { type: 'heading', label: '見出し (H2)' },
  { type: 'paragraph', label: '文章' },
  { type: 'blockquote', label: '引用' },
  { type: 'orderedList', label: '順序付きリスト' },
  { type: 'unorderedList', label: '順序なしリスト' },
  { type: 'horizontalRule', label: '区切り線' },
  { type: 'code', label: 'コードブロック' },
];

// 簡単なモーダル実装例
function AddBlockDialog({ onSelect, onClose }) {
  return (
    <div style={{
      position: 'fixed', // または absolute (親要素基準)
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      border: '1px solid #ccc',
      padding: '20px',
      zIndex: 1000, // 他の要素より手前に表示
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <h3>追加するブロックを選択</h3>
      <ul>
        {blockTypes.map(block => (
          <li key={block.type} style={{ marginBottom: '5px' }}>
            <button onClick={() => onSelect(block.type)}>
              {block.label}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={onClose} style={{ marginTop: '10px' }}>キャンセル</button>
    </div>
  );
}

export default AddBlockDialog;

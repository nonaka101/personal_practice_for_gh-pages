import React from 'react';

function CodeBlock({ content, language, onContentChange, onLanguageChange }) {
  const handleTextChange = (event) => {
    onContentChange(event.target.value);
  };

  const handleLanguageInputChange = (event) => {
    onLanguageChange(event.target.value);
  };

  return (
    <div>
      {/* markdown要素コントロールに言語指定inputを追加 */}
      <input
        type="text"
        value={language}
        onChange={handleLanguageInputChange}
        placeholder="言語 (例: javascript)"
        style={{ marginBottom: '5px', display: 'block', width: '30%' }}
      />
      <textarea
        value={content}
        onChange={handleTextChange}
        placeholder="コードを入力..."
        rows={5}
        style={{
          width: '100%',
          minHeight: '80px',
          resize: 'vertical',
          fontFamily: 'monospace', // 等幅フォント
          backgroundColor: '#f5f5f5', // 背景色
          border: '1px solid #ccc',
          padding: '10px',
        }}
      />
    </div>
  );
}

export default CodeBlock;

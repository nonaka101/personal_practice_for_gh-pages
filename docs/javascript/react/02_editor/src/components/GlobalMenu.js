import React from 'react';

function GlobalMenu({ title, setTitle, blocks, onExport, onSave }) {
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  // 見出しブロックのみを抽出
  const headings = blocks.filter(block => block.type === 'heading');

  return (
    <div style={{ borderBottom: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
      <h1>Markdown Editor</h1>
      <div>
        <label htmlFor="doc-title">Document Title (H1): </label>
        <input
          id="doc-title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          style={{ fontSize: '1.5em', width: '50%' }}
        />
      </div>

      {/* 見出しジャンプ */}
      {headings.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <strong>Outline:</strong>
          <ul>
            {headings.map(heading => (
              <li key={heading.id}>
                <a href={`#block-${heading.id}`}>
                  {'--'.repeat(heading.level - 1)} {heading.content || '(empty)'}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 書き出しボタン */}
      <div style={{ marginTop: '10px' }}>
        <button onClick={onExport}>Copy Markdown to Clipboard</button>
        <button onClick={onSave} style={{ marginLeft: '10px' }}>Save as .md File</button>
      </div>
    </div>
  );
}

export default GlobalMenu;
